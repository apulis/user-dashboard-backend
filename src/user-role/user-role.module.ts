import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService],
  imports: [TypeOrmModule.forFeature([UserRole])]
})
export class UserRoleModule {}
