/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Get, Post, Body, Res, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { getDomainFromUrl } from 'src/utils';
import { apiBase } from 'src/constants/config';
import axios from 'axios';

const MS_OAUTH2_URL = `https://login.microsoftonline.com/common/oauth2/v2.0`


const getAuthenticationUrl = (options: {to: string} )=> {
  const params = new URLSearchParams({
    client_id: '19441c6a-f224-41c8-ac36-82464c2d9b13',
    response_type: 'code',
    redirect_uri: getDomainFromUrl(options.to) + apiBase+ '/api/microsoft',
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
  ) {
    if (code) {
      // get info from ms
      const userInfo = this.authService.getMicrosoftAccountInfo(code);
    } else if (to) {
      res.redirect(getAuthenticationUrl({
        to
      }))
    }
  }

  @Get('/wechat')
  async loginWithWechat() {
    //
  }
}
