import { Controller, Get, Post, Body, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request, Express } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
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
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    const user = (req.user as User);
    const currentAuthority = await this.authService.getUserRoles(user.id);
    if (user) {
      res.send({
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
  async loginWithMicrosoft() {
    console.log(111)
  }

  @Get('/wechat')
  async loginWithWechat() {
    //
  }
}
