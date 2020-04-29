import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UserRoleService } from 'src/user-role/user-role.service';
import { CreateUserDto, EditUserDto } from './user.dto'
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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

@Controller('/users')
@UseGuards(AuthGuard())
@ApiTags('用户')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService
    ) {}

  @Get('/list')
  @ApiProperty({
    description: '分页获取用户列表'
  })
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
    
    
    res.status(HttpStatus.OK).json({
      success: true, 
      list: result.list,
      total: result.total,
    });
    return result.list;
  }

  @Post('/')
  @ApiProperty({
    description: '新增用户'
  })
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
  @ApiProperty({
    description: '删除用户'
  })
  async removeUsers(@Body() body: string[], @Res() res: Response) {
    const userNames = body
    const result: UpdateResult = await this.userService.remove(userNames);
    res.status(HttpStatus.ACCEPTED).json({
      success: true,
      message: `Success remove ${result.raw.affectedRows} records`
    })
  }

  @Get('/detail/:id')
  @ApiProperty({
    description: '获取用户详情'
  })
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const userId = Number(id);
    const user = await this.userService.getUserById(userId);
    res.send({
      success: true,
      user: user[0],
    })
  }

  @Patch('/:id')
  @ApiProperty({
    description: '修改用户角色'
  })
  async editUserRole(@Param('id') id: number, @Body() userInfo: EditUserDto, @Res() res: Response) {
    const userId = Number(id);
    const { email, phone, note, nickName} = userInfo;
    await this.userService.editUserDetail(userId, email, phone, note, nickName);
    res.send({
      success: true,
    })
  }

  @Get('/count')
  @ApiProperty({
    description: '获取用户总数'
  })
  async getTotalUsersCount(@Res() res: Response) {
    const count: number = await this.userService.getUserCount()
    res.send({
      success: true,
      count,
    })
  }
}
