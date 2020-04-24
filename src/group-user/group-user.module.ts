import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUser } from './group-user.entity';
import { GroupUserController } from './group-user.controller';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupUser, User])],
  providers: [GroupUserService, UserService],
  controllers: [GroupUserController]
})
export class GroupUserModule {}
