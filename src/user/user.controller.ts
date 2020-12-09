import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param, Patch, Put, UseGuards, MethodNotAllowedException } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UserRoleService } from 'src/user-role/user-role.service';
import { CreateUserDto, EditUserDto, resetPasswordDto } from './user.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthzGuard } from 'src/guards/authz.guard';
import { ConfigService } from 'config/config.service';
import { AuthService } from 'src/auth/auth.service';

export interface IUserMessage {
  userName: string;
  password: string;
  phone?: string;
  email?: string;
  nickName?: string;
  note?: string;
  id?: number;
}

export type TypeUserRole = string[];

export interface ICreateUser {
  userMessage: IUserMessage[];
  userRole: TypeUserRole
}

export interface IResponseUserList extends User {
  role?: string[];
}


@Controller('/users')
@UseGuards(RolesGuard)
@ApiTags('用户')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly config: ConfigService,
    private readonly authService: AuthService
    ) {}

  @Get('/list')
  @ApiOperation({
    description: '分页获取用户列表'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async getUsers(
    @Res() res: Response,
    @Query('pageNo') pageNo?: string | number, 
    @Query('pageSize') pageSize?: string | number,
    @Query('search') search?: string
  ): Promise<User[]> {
    let result;
    if (typeof pageNo === 'undefined') {
      pageNo = 1;
    }
    if (typeof pageSize === 'undefined') {
      if (search) {
        result = await this.userService.findAllLike(search);
      } else {
        result = await this.userService.findAll();
      }
    } else {
      if (search) {
        result = await this.userService.findLike(Number(pageNo) - 1, Number(pageSize), search);
      } else {
        result = await this.userService.find(Number(pageNo) - 1, Number(pageSize));
      }
    }
    const list: IResponseUserList[] = result.list;
    if (list.length > 0) {
      const role = await this.userRoleService.getUsersRoles(list.map(val => val.id));
      
      role.forEach(r => {
        const user = list.find(val => val.id === r.userId);
        if (user) {
          if (!user.role) {
            user.role = [r.role.name]
          } else {
            user.role.push(r.role.name)
          }
        }
      })
    }
    
    res.status(HttpStatus.OK).json({
      success: true, 
      list,
      total: result.total,
    });
    return result.list;
  }

  @Post('/')
  @ApiOperation({
    description: '新增用户'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async createUsers(@Body() body: CreateUserDto, @Res() res: Response) {
    const { userMessage, userRole } = body;
    const userNames = userMessage.map(val => val.userName);
    const uniqueUserName = await this.userService.userNameUnique(userNames);
    if (uniqueUserName && uniqueUserName.length > 0) {
      res.status(HttpStatus.OK).json({
        success: false,
        conflictedUserName: uniqueUserName,
      })
    } else {
      await this.userService.create(userMessage);
      const userNames = userMessage.map(u => u.userName)
      const userInfo = await this.userService.findUserByUserNames(userNames);
      const userIds = userInfo.map(u => u.id);
      await this.userRoleService.addRoleToUser(userIds, userRole);
      res.status(HttpStatus.CREATED).send({
        success: true,
        message: 'ok',
      })
    }
  }

  @Delete('/')
  @ApiOperation({
    description: '删除用户'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async removeUsers(@Body() body: number[], @Res() res: Response) {
    const userIds = body;
    await this.authService.checkIfChangeAdminUsers(userIds);
    const removingUsers: any[] = await this.userService.findUsersByUserIds(userIds);
    const userNames = removingUsers.map(u => u.userName);
    const result = await this.userService.remove(userNames, userIds);
    if (result.success) {
      res.status(HttpStatus.ACCEPTED).json({
        success: true,
      });
    } else {
      res.send(result);
    }
    
  }

  @Get('/detail/:id')
  @ApiOperation({
    description: '获取用户详情'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const userId = Number(id);
    const user = await this.userService.getUserById(userId);
    res.send({
      success: true,
      user: user[0],
    })
  }

  @Patch('/:id')
  @ApiOperation({
    description: '修改用户详情'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async editUserRole(@Param('id') id: number, @Body() userInfo: EditUserDto, @Res() res: Response) {
    const userId = Number(id);
    await this.authService.checkIfChangeAdminUsers([userId]);
    const { email, phone, note, nickName} = userInfo;
    await this.userService.editUserDetail(userId, email, phone, note, nickName);
    res.send({
      success: true,
    })
  }

  @Get('/count')
  @ApiOperation({
    description: '获取用户总数'
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async getTotalUsersCount(@Res() res: Response) {
    const count: number = await this.userService.getUserCount()
    res.send({
      success: true,
      count,
    })
  }

  @Get('/adminUsers')
  @ApiOperation({
    description: '获取管理员用户'
  })
  async getAdminUsers(@Res() res: Response) {
    const adminUserNames: string[] = JSON.parse(this.config.get('ADMINISTRATOR_USER_NAME'));
    res.send({
      success: true,
      list: adminUserNames,
    })
  }

  @Put('/:userId/unbind/microsoft')
  @ApiOperation({
    description: '解绑微软账号',
  })
  @UseGuards(AuthGuard('jwt'))
  async unbindMicrosoft(@Param('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    await this.authService.checkIfChangeAdminUsers([userId]);
    const result = await this.userService.unbindMicrosoftId(userId);
    let status: HttpStatus;
    if (result === false) {
      status = 200;
    } else {
      status = 201;
    }
    res.status(status).send({
      success: status === 201 ? true : false,
    })
  }

  @Put('/:userId/unbind/wechat')
  @ApiOperation({
    description: '解绑微信账号',
  })
  @UseGuards(AuthGuard('jwt'))
  async unbindWechat(@Param('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    await this.authService.checkIfChangeAdminUsers([userId]);
    const result = await this.userService.unbindWechatId(userId);
    let status: HttpStatus;
    if (result === false) {
      status = 200;
    } else {
      status = 201;
    }
    res.status(status).send({
      success: status === 201 ? true : false,
    })
  }




  @Patch('/:userId/resetPassword')
  @ApiOperation({
    description: '重置用户密码',
  })
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  async resetUserPassword(@Param('userId') userId: number, @Body() resetPassword: resetPasswordDto, @Res() res: Response) {
    userId = Number(userId);
    // await this.authService.checkIfChangeAdminUsers([userId]);
    const result = await this.userService.resetPassword(userId, resetPassword.newPassword);
    let status: HttpStatus;
    if (result === false) {
      status = 200;
    } else {
      status = 201;
    }
    res.status(status).send({
      success: status === 201 ? true : false,
    })
  }
}
