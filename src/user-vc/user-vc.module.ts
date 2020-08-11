import { Module } from '@nestjs/common';
import { UserVcService } from './user-vc.service';
import { UserVcController } from './user-vc.controller';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  providers: [UserVcService, ConfigService, UserService],
  controllers: [UserVcController],
  imports: [InitCasbin, TypeOrmModule.forFeature([User])]
})
export class UserVcModule {}
