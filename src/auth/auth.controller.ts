import { Controller, Get, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { encodePassword } from 'src/utils';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    
  }

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const { userName, password, nickName } = body;
    await this.userService.create([{
      userName,
      nickName,
      password,
    }])
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
  @UseGuards(AuthGuard())
  async getCurrentUser(): Promise<string[]> {
    return ['role1']
  }

  @Get('/microsoft')
  async loginWithMicrosoft() {
    console.log(111)
  }

  @Get('/wechat')
  async loginWithWechat() {
    //
  }
}
