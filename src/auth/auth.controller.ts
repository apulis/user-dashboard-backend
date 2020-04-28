import { Controller, Get, Post, Body, Res, HttpStatus, HttpCode } from '@nestjs/common';
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
    const validatedUser = await this.authService.validateUser(userName, password);
    if (validatedUser) {
      const token = await this.authService.getIdToken(validatedUser.id, validatedUser.userName);
      res.cookie('token', token);
      res.send({
        success: true,
        token,
      })
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        message: 'UNAUTHORIZED'
      })
    }
  }

  @Get('/currentUser')
  async getCurrentUser(): Promise<string[]> {
    return ['role1']
  }
}
