import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUser } from './group-user.entity'
import { GroupUserController } from './group-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupUser])],
  providers: [GroupUserService],
  controllers: [GroupUserController]
})
export class GroupUserModule {}
