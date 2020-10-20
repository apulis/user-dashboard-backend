import { Module } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { PlatformConfigController } from './platform-config.controller';

@Module({
  controllers: [PlatformConfigController],
  providers: [ConfigService]
})
export class PlatformConfigModule {
}
