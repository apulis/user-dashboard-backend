import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { CasbinService } from 'src/common/authz';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { PermissionService } from 'src/permission/permission.service';
import { Permission } from 'src/permission/permission.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), InitCasbin],
  controllers: [RoleController],
  providers: [RoleService, CasbinService, PermissionService]
})
export class RoleModule {}
