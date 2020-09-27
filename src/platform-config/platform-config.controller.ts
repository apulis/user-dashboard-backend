import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ConfigService } from 'config/config.service';

@Controller('platform-config')
export class PlatformConfigController {

  constructor(
    private readonly config: ConfigService,
  ) {
    
  }

  @Get('/')
  @ApiOperation({
    summary: '获取平台配置',
  })
  async getPlatformConfig() {
    return { 
      success: true,
      platformName: this.config.get('PLATFORM_NAME'),
      enableVC: this.config.vcEnabled(),
      i8n: this.config.i18n(),
    }
  }  
}
