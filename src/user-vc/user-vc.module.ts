import { Module } from '@nestjs/common';
import { UserVcService } from './user-vc.service';
import { UserVcController } from './user-vc.controller';
import { InitCasbin } from 'src/common/authz/init-casbin';
import { ConfigService } from 'config/config.service';

@Module({
  providers: [UserVcService, ConfigService],
  controllers: [UserVcController],
  imports: [InitCasbin]
})
export class UserVcModule {}
