import { Controller, Get, Req, Res, HttpStatus, UseGuards, Query, Param } from '@nestjs/common';
import { IRequestUser } from 'src/auth/auth.controller';
import { Request, Response } from 'express';
import { CookieGuard } from 'src/guards/cookie.guard';
import { ConfigService } from 'config/config.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('给其他平台使用的 api')
@Controller('open')
export class OpenController {

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService
  ) {
    
  }

  @Get('/currentUser')
  @ApiOperation({
    description: '获取当前用户的角色权限信息（根据 cookie）'
  })
  @UseGuards(CookieGuard)
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
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
      });
    } else {
      res.status(HttpStatus.UNAUTHORIZED)
    }
    
  }

  @Get('/getUserIdByUserName/:userName')
  async getUIdByUserName(@Param('userName') userName: string, @Res() res: Response) {
    const userId = await this.userService.getUserIdsByUserNames([userName]);
    console.log('userId', userId);
    res.send({
      success: true,
      uid: userId[0].id,
    });
  }
}
