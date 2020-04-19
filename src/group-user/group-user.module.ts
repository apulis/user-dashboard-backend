import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUser } from './group-user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GroupUser])],
  providers: [GroupUserService],
})
export class GroupUserModule {}
