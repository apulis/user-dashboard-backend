import { Module } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { OpenController } from './open.controller';
import { OpenService } from './open.service';

@Module({
  controllers: [OpenController],
  providers: [OpenService, ConfigService],
})
export class OpenModule {
}
