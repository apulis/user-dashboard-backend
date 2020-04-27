import { Controller, Get, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { encodePassword } from 'src/utils';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
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
  async login(@Body() body: LoginDto) {
    const { userName, password } = body;

  }

  @Get('/currentUser')
  async getCurrentUser(): Promise<string[]> {
    return ['role1']
  }
}
