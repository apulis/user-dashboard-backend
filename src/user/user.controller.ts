import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserList(pageNo: number, pageSize: number): UserEntity[] {
    return [];
  }

  @Post()
  addUsers(users: any[]) {

  }
}
