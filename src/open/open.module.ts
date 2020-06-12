import { Module } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { GroupUser } from 'src/group-user/group-user.entity';
import { GroupRole } from 'src/group-role/group-role.entity';
import { UserRole } from 'src/user-role/user-role.entity';
import { Role } from 'src/role/role.entity';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { UserService } from 'src/user/user.service';
import { ResetPassword } from 'src/user/reset-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GroupUser, GroupRole, UserRole, Role, ResetPassword]), InitCasbin],
  controllers: [OpenController],
  providers: [OpenService, ConfigService, AuthService, UserService],
})
export class OpenModule {
}
