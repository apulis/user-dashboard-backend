import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';

@Module({
  providers: [GroupRoleService],
  controllers: [GroupRoleController]
})
export class GroupRoleModule {}
