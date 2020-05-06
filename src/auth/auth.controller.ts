/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Get, Post, Body, Res, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { getDomainFromUrl } from 'src/utils';
import { apiBase, MS_OAUTH2_URL } from 'src/constants/config';
import { ConfigService } from 'config/config.service';

interface IState {
  to: string;
  userId?: number
}


const getAuthenticationUrl = (options: { to: string; clientId: string; userId?: number }) => {
  let state;
  if (options.userId) {
    state = JSON.stringify({
      to: options.to,
      userId: options.userId,
    })
  } else {
    state = JSON.stringify({
      userId: options.userId,
    })
  }
  const params = new URLSearchParams({
    client_id: options.clientId,
    response_type: 'code',
    redirect_uri: getDomainFromUrl(options.to) + apiBase+ '/api/auth/microsoft',
    response_mode: 'query',
    scope: 'openid profile email',
    state: state
  })
  return MS_OAUTH2_URL + '/authorize?' + params
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    
  }

  @Post('/register')
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
      //
    }
    
    res.send({
      success: true
    })
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { userName, password } = body;
    const validatedUser = await this.authService.validateUserAccount(userName, password);
    if (validatedUser) {
      const token = await this.authService.getIdToken(validatedUser.id, validatedUser.userName);
      const currentAuthority = await this.authService.getUserRoles(validatedUser.id);
      res.cookie('token', token);
      res.send({
        success: true,
        token,
        currentAuthority,
        currentPermission: [],
      })
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        message: 'UNAUTHORIZED',
      })
    }
  }

  @Get('/currentUser')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    const user = (req.user as User);
    const currentAuthority = await this.authService.getUserRoles(user.id);
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
        nickName: user.nickName,
        currentAuthority,
      })
    } else {
      res.status(HttpStatus.UNAUTHORIZED)
    }
    
  }

  @Get('/microsoft')
  async loginWithMicrosoft(
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('to') to?: string,
    @Query('state') state?: string,
    @Query('userId') userId?: number
  ) {
    if (code) {
      const stateObj: IState = JSON.parse(state as string);
      if (!stateObj.userId) {
        // 新用户
        const userInfo = await this.authService.getMicrosoftAccountInfo(code, getDomainFromUrl(stateObj.to) + apiBase+ '/api/auth/microsoft');
        const user = await this.userService.getUserInfoByOpenId(userInfo.openId, userInfo.nickName, userInfo.registerType);
        if (user) {
          const token = this.authService.getIdToken(user.id, user.userName);
          res.cookie('token', token);
          res.redirect(stateObj.to + '?token=' + token);
        }
      } else {
        // 已经有账号，来绑定的用户
        const userInfo = await this.authService.getMicrosoftAccountInfo(code, getDomainFromUrl(stateObj.to) + apiBase+ '/api/auth/microsoft');
        const dbUser = await this.userService.updateUserMicrosoftId(stateObj.userId, userInfo.openId);
        if (dbUser) {
          const token = this.authService.getIdToken(stateObj.userId, dbUser.userName);
          res.cookie('token', token);
          res.redirect(stateObj.to + '?token=' + token);
        } else {
          res.redirect(stateObj.to + '?error=no such user' );
        }
      }
      
    } else if (to) {
      let redirect: string;
      if (userId) {
        userId = Number(userId);
        redirect = getAuthenticationUrl({
          to,
          userId,
          clientId: this.config.get('MS_CLIENT_ID')
        });
      } else {
        redirect = getAuthenticationUrl({
          to,
          clientId: this.config.get('MS_CLIENT_ID')
        });
      }
      
      res.redirect(redirect);
    }
  }

  @Get('/wechat')
  async loginWithWechat() {
    //
  }
}
