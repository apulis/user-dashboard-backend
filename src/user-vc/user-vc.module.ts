import { Module } from '@nestjs/common';
import { UserVcService } from './user-vc.service';
import { UserVcController } from './user-vc.controller';

@Module({
  providers: [UserVcService],
  controllers: [UserVcController]
})
export class UserVcModule {}
