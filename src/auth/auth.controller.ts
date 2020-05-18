/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Get, Post, Body, Res, HttpStatus, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import WechatOauth from 'wechat-oauth-ts';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { getDomainFromUrl } from 'src/utils';
import { apiBase, MS_OAUTH2_URL, WX_OAUTH2_URL } from 'src/constants/config';
import { ConfigService } from 'config/config.service';
import { RegisterTypes } from 'src/constants/enums';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CasbinService } from 'src/common/authz';

import { getJwtExp }  from 'src/utils';

interface IState {
  to: string;
  userId?: number
}

export interface IRequestUser extends User {
  currentRole: string[];
  permissionList: string[];
}

const getWXAuthenticationUrl = (options: { to: string; clientId: string; userId?: number }) => {
  let state;
  if (options.userId) {
    state = JSON.stringify({
      to: options.to,
      userId: options.userId,
    })
  } else {
    state = JSON.stringify({
      to: options.to,
    })
  }
  const params = new URLSearchParams({
    appid: options.clientId,
    response_type: 'code',
    redirect_uri: getDomainFromUrl(options.to) + apiBase+ '/auth/wechat',
    scope: 'snsapi_userinfo,snsapi_login',
    state: encodeURIComponent(state)
  })
  return WX_OAUTH2_URL + '?' + params
}

const getMSAuthenticationUrl = (options: { to: string; clientId: string; userId?: number }) => {
  let state;
  if (options.userId) {
    state = JSON.stringify({
      to: options.to,
      userId: options.userId,
    })
  } else {
    state = JSON.stringify({
      to: options.to,
    })
  }
  const params = new URLSearchParams({
    client_id: options.clientId,
    response_type: 'code',
    redirect_uri: getDomainFromUrl(options.to) + apiBase+ '/auth/microsoft',
    response_mode: 'query',
    scope: 'openid profile email',
    state: state
  })
  return MS_OAUTH2_URL + '/authorize?' + params
}


@Controller('auth')
@ApiTags('用户认证相关')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly casbinService: CasbinService
  ) {
    
  }

  @Post('/register')
  @ApiOperation({
    description: '注册账号密码'
  })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const { userName, password, nickName, microsoftId, wechatId } = body;
    const userNameUnique = await this.userService.userNameUnique([userName]);
    if (userNameUnique.length > 0) {
      res.send({
        success: false,
        duplicate: true,
      })
      return;
    }
    if (!microsoftId && !wechatId) {
      await this.userService.create([{
        userName,
        nickName,
        password,
      }]);
    } else if (microsoftId) {
      await this.userService.signUpByMicrosoftId(microsoftId, {
        userName, password, nickName
      })
    } else if (wechatId) {
      await this.userService.signUpByWechatId(wechatId, {
        userName, password, nickName
      })
    }
    
    res.send({
      success: true
    })
  }

  @Post('/login')
  @ApiOperation({
    description: '账号密码登录'
  })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { userName, password } = body;
    const validatedUser = await this.authService.validateUserAccount(userName, password);
    if (validatedUser) {
      const token = await this.authService.getIdToken(validatedUser.id, validatedUser.userName);
      const currentRole = await this.authService.getUserRoles(validatedUser.id);
      const permissionList = await this.authService.getUserPermissionList(validatedUser.id)
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: getJwtExp()
      });
      res.send({
        success: true,
        token,
        currentRole,
        permissionList: permissionList,
      })
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        message: 'UNAUTHORIZED',
      })
    }
  }

  @Get('/currentUser')
  @ApiOperation({
    description: '获取当前用户权限角色信息'
  })
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    const user = (req.user as IRequestUser);
    if (user) {
      res.send({
        success: true,
        id: user.id,
        userName: user.userName,
        phone: user.phone,
        registerType: user.registerType,
        email: user.email,
        openId: user.openId,
        microsoftId: user.microsoftId,
        wechatId: user.wechatId,
        nickName: user.nickName,
        currentRole: user.currentRole,
        permissionList: user.permissionList
      })
    } else {
      res.status(HttpStatus.UNAUTHORIZED)
    }
    
  }

  @Get('/microsoft')
  @ApiOperation({
    description: '使用微软账号认证，直接跳转'
  })
  async loginWithMicrosoft(
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('to') to?: string,
    @Query('state') state?: string,
    @Query('userId') userId?: number
  ) {
    if (code) {
      // 微软的回调
      const stateObj: IState = JSON.parse(state as string);
      if (!stateObj.userId) {
        // 用户直接登录
        const userInfo = await this.authService.getMicrosoftAccountInfo(code, getDomainFromUrl(stateObj.to) + apiBase+ '/auth/microsoft');
        const user = await this.userService.getMSUserInfoByOpenId(userInfo.openId, userInfo.nickName, userInfo.registerType);
        if (user) {
          const token = this.authService.getIdToken(user.id, user.userName);
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: getJwtExp()
          });
          res.redirect(stateObj.to + '?token=' + token);
        }
      } else {
        // 已经有账号，来绑定的用户
        const userInfo = await this.authService.getMicrosoftAccountInfo(code, getDomainFromUrl(stateObj.to) + apiBase+ '/auth/microsoft');
        if (await this.authService.getUserByMicrosoftId(userInfo.openId)) {
          res.redirect(stateObj.to + '?error=' + 'current microsoft account has been used');
          return;
        }
        const dbUser = await this.userService.updateUserMicrosoftId(stateObj.userId, userInfo.openId);
        if (dbUser) {
          const token = this.authService.getIdToken(stateObj.userId, dbUser.userName);
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: getJwtExp()
          });
          res.redirect(stateObj.to + '?token=' + token);
        } else {
          throw new ForbiddenException('no such user');
        }
      }
      
    } else if (to) {
      // 前端主动访问
      let redirect: string;
      if (userId) {
        userId = Number(userId);
        redirect = getMSAuthenticationUrl({
          to,
          userId,
          clientId: this.config.get('MS_CLIENT_ID')
        });
      } else {
        redirect = getMSAuthenticationUrl({
          to,
          clientId: this.config.get('MS_CLIENT_ID')
        });
      }
      
      res.redirect(redirect);
    }
  }

  @Get('/wechat')
  @ApiOperation({
    description: '使用微信登录认证，直接跳转'
  })
  async loginWithWechat(
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('to') to?: string,
    @Query('state') state?: string,
    @Query('userId') userId?: number
  ) {
    const WX_APP_ID = this.config.get('WX_APP_ID');
    const WX_SECRET = this.config.get('WX_SECRET');
    if (code) {
      // 微信回调
      const wxOauth = new WechatOauth(WX_APP_ID, WX_SECRET);
      const accessToken = await wxOauth.getAccessToken(code);
      const openId = accessToken.openid;
      const unionId: string = (accessToken as any).unionid;
      const { nickname } = await wxOauth.getUserByOpenId(openId);
      const stateObj: IState = JSON.parse(state as string);
      let tempOpenId = '';
      if (unionId) {
        tempOpenId = 'unionId--' + unionId
      } else {
        tempOpenId = 'openId--' + openId;
      }
      if (!stateObj.userId) {
        // 用户直接扫码登录
        const user = await this.userService.getWXUserInfoByOpenId(tempOpenId, nickname, RegisterTypes.Wechat);
        if (user) {
          const token = this.authService.getIdToken(user.id, user.userName);
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: getJwtExp()
          });
          res.redirect(stateObj.to + '?token=' + token);
        }
      } else {
        if (await this.authService.getUserByWechatId(tempOpenId)) {
          res.redirect(stateObj.to + '?error=' + 'current wechat account has been used');
          return;
        }
        const dbUser = await this.userService.updateUserWechatId(stateObj.userId, tempOpenId);
        
        if (dbUser) {
          const token = this.authService.getIdToken(stateObj.userId, dbUser.userName);
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: getJwtExp()
          });
          res.redirect(stateObj.to + '?token=' + token);
        } else {
          throw new ForbiddenException('no such user');
        }
      }

    } else if (to) {
      // 前端主动跳转
      let redirect: string;
      if (userId) {
        userId = Number(userId);
        redirect = getWXAuthenticationUrl({
          to,
          userId,
          clientId: WX_APP_ID
        });
      } else {
        redirect = getWXAuthenticationUrl({
          to,
          clientId: WX_APP_ID
        });
      }
      
      res.redirect(redirect);
    }
  }

  @Get('/oauth2-methods')
  @ApiOperation({
    description: '获取当前第三方认证的方式'
  })
  getAuthMethod(@Res() res: Response) {
    const methods = [];
    if (this.config.get('WX_APP_ID')) {
      methods.push('wechat');
    }
    if (this.config.get('MS_CLIENT_ID')) {
      methods.push('microsoft');
    }
    res.send({
      success: true,
      methods
    })
  }

  @Get('logout')
  @ApiOperation({
    description: '注销登录'
  })
  async logout(@Res() res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      maxAge: getJwtExp()
    });
    res.send({
      success: true
    })
  }
}
