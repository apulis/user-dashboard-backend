import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRole } from 'src/group-role/group-role.entity';
import { GroupRoleService } from 'src/group-role/group-role.service';


@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupRole])],
  providers: [GroupService, GroupRoleService],
  controllers: [GroupController]
})
export class GroupModule {}
