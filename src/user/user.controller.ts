import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';

export interface IUserMessage {
  userName: string;
  password: string;
  phone?: string;
  email?: string;
  nickName?: string;
  note?: string;
}

export type TypeUserRole = string[];

export interface ICreateUser {
  userMessage: IUserMessage[];
  userRole: TypeUserRole
}

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  async getUsers(
    @Query('pageNo') pageNo: string, 
    @Query('pageSize') pageSize: string,
    @Res() res: Response,
    @Query('search') search?: string
  ): Promise<User[]> {
    let result;
    if (search) {
      result = await this.userService.findLike(Number(pageNo) - 1, Number(pageSize), search);
    } else {
      result = await this.userService.find(Number(pageNo) - 1, Number(pageSize));
    }
    
    res.status(HttpStatus.OK).json({
      success: true, 
      list: result.list,
      total: result.total,
    });
    return result.list;
  }

  @Post('/')
  async createUsers(@Body() body: ICreateUser, @Res() res: Response) {
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
      // TODO: ADD ROLE
      res.status(HttpStatus.CREATED).send({
        success: true,
        message: 'ok',
      })
    }
  }

  @Delete('/')
  async removeUsers(@Body() body: string[], @Res() res: Response) {
    const userNames = body
    const result: UpdateResult = await this.userService.remove(userNames);
    res.status(HttpStatus.ACCEPTED).json({
      success: true,
      message: `Success remove ${result.raw.affectedRows} records`
    })
  }
}
