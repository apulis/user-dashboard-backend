import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUser } from './group-user.entity';
import { GroupUserController } from './group-user.controller';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';
import { Group } from 'src/group/group.entity';
import { ConfigService } from 'config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupUser, User, Group])],
  providers: [GroupUserService, UserService, GroupService, ConfigService],
  controllers: [GroupUserController]
})
export class GroupUserModule {}
