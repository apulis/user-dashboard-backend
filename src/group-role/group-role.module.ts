import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRole } from './group-role.entity';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRole, Role])],
  providers: [GroupRoleService, RoleService],
  controllers: [GroupRoleController]
})
export class GroupRoleModule {}
