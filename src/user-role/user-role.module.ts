import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { GroupUser } from 'src/group-user/group-user.entity';
import { GroupRole } from 'src/group-role/group-role.entity';
import { ResetPassword } from 'src/user/reset-password.entity';
import { RedisProvider } from 'src/common/cache-manager';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, RoleService, UserService, ConfigService, AuthService, RedisProvider],
  imports: [TypeOrmModule.forFeature([UserRole, Role, User, GroupUser, GroupRole, ResetPassword]), InitCasbin]
})
export class UserRoleModule {}
