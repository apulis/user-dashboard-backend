import { Controller, Get, Post, Body, Res, Query, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';

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

  @Get('/')
  async getUsers(
    @Query('pageNo') pageNo: string, 
    @Query('pageSize') pageSize: string,
    @Res() res: Response
  ): Promise<User[]> {
    const list = await this.userService.find(Number(pageNo), Number(pageSize));
    res.status(HttpStatus.OK).json({
      success: true,
      list,
    });
    return list;
  }

  @Post('/')
  async createUsers(@Body() body: ICreateUser, @Res() res: Response) {
    const { userMessage, userRole } = body;
    await this.userService.create(userMessage);
    res.status(HttpStatus.CREATED).send({
      success: true,
      message: 'ok',
    })
  }

}
