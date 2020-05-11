import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRole } from './group-role.entity';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.entity';
import { CasbinService, CasbinModule } from 'src/common/authz';
import { typeOrmConfig } from 'src/db/typeorm';
import { InitCasbin } from 'src/common/authz/init-casbin';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRole, Role]), InitCasbin],
  providers: [GroupRoleService, RoleService, CasbinService],
  controllers: [GroupRoleController]
})
export class GroupRoleModule {}
