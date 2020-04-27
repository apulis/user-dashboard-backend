import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user-role/user-role.entity';
import { UserRoleService } from 'src/user-role/user-role.service';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  controllers: [UserController],
  providers: [UserService, UserRoleService, ConfigService],
})
export class UserModule {}