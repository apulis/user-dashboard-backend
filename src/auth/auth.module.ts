import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { ConfigService } from 'config/config.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUser } from 'src/group-user/group-user.entity';
import { GroupRole } from 'src/group-role/group-role.entity';
import { UserRole } from 'src/user-role/user-role.entity';
import { Role } from 'src/role/role.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, GroupUser, GroupRole, UserRole, Role])],
  providers: [AuthService, UserService, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
