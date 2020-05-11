import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import { InitCasbin } from 'src/common/authz/init-casbin';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, RoleService],
  imports: [TypeOrmModule.forFeature([UserRole, Role]), InitCasbin]
})
export class UserRoleModule {}
