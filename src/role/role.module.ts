import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { CasbinService } from 'src/common/authz';
import { InitCasbin } from 'src/common/authz/init-casbin';
@Module({
  imports: [TypeOrmModule.forFeature([Role]), InitCasbin],
  controllers: [RoleController],
  providers: [RoleService, CasbinService]
})
export class RoleModule {}
