import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user-role/user-role.entity';
import { UserRoleService } from 'src/user-role/user-role.service';
import { ConfigService } from 'config/config.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.entity';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { ResetPassword } from './reset-password.entity';
import { AuthService } from 'src/auth/auth.service';
import { GroupRole } from 'src/group-role/group-role.entity';
import { GroupUser } from 'src/group-user/group-user.entity';
import { RedisProvider } from 'src/common/cache-manager';
import { UserVcService } from 'src/user-vc/user-vc.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role, ResetPassword, GroupRole, GroupUser]), InitCasbin],
  controllers: [UserController],
  providers: [
    UserService,
    UserRoleService,
    ConfigService,
    RoleService,
    AuthService,
    RedisProvider,
    UserVcService
  ],
})
export class UserModule {}