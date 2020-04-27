import { Controller, Get, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
    
  }

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const { userName, password, nickName } = body;
    
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
