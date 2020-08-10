import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { ConfigService } from 'config/config.service';
import { User } from 'src/user/user.entity';
import { GroupUser } from 'src/group-user/group-user.entity';
import { GroupRole } from 'src/group-role/group-role.entity';
import { UserRole } from 'src/user-role/user-role.entity';
import { Role } from 'src/role/role.entity';
import { JwtStrategy } from './jwt.strategy';
import { CasbinService } from 'src/common/authz';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { ResetPassword } from 'src/user/reset-password.entity';
import { RedisProvider } from 'src/common/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GroupUser, GroupRole, UserRole, Role, ResetPassword]),
    InitCasbin
  ],
  providers: [AuthService, UserService, ConfigService, JwtStrategy, CasbinService, RedisProvider],
  controllers: [AuthController],
})
export class AuthModule {}
