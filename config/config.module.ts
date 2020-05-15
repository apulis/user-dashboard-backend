import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.CONFIG_PATH}` || 'develop.env'),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}