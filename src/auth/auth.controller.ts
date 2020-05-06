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


const getAuthenticationUrl = (options: { to: string; clientId: string }) => {
  const params = new URLSearchParams({
    client_id: options.clientId,
    response_type: 'code',
    redirect_uri: getDomainFromUrl(options.to) + apiBase+ '/api/auth/microsoft',
    response_mode: 'query',
    scope: 'openid profile email',
    state: options.to
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
    const { userName, password, nickName } = body;
    await this.userService.create([{
      userName,
      nickName,
      password,
    }]);
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
        id: user,
        userName: user.userName,
        phone: user.phone,
        registerType: user.registerType,
        email: user.email,
        openId: user.openId,
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
    @Query('state') state?: string
  ) {
    if (code) {
      const userInfo = await this.authService.getMicrosoftAccountInfo(code, getDomainFromUrl(state!) + apiBase+ '/api/auth/microsoft');
      const user = await this.userService.getUserInfoByOpenId(userInfo.openId, userInfo.nickName, userInfo.registerType);
      if (user) {
        const token = this.authService.getIdToken(user.id, user.userName);
        res.cookie('token', token);
        res.redirect(state + '?token=' + token);
      }
    } else if (to) {
      const redirect = getAuthenticationUrl({
        to,
        clientId: this.config.get('MS_CLIENT_ID')
      });
      res.redirect(redirect);
    }
  }

  @Get('/wechat')
  async loginWithWechat() {
    //
  }
}
