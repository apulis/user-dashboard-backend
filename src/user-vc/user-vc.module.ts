import { Module } from '@nestjs/common';
import { UserVcService } from './user-vc.service';
import { UserVcController } from './user-vc.controller';
import { InitCasbin } from 'src/common/authz/init-casbin';

@Module({
  providers: [UserVcService],
  controllers: [UserVcController],
  imports: [InitCasbin]
})
export class UserVcModule {}
