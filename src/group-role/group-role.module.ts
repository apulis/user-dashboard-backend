import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRole } from './group-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRole])],
  providers: [GroupRoleService],
  controllers: [GroupRoleController]
})
export class GroupRoleModule {}
