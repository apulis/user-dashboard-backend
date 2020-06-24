import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('language')
@ApiTags('设置语言相关')
export class LanguageController {
  @Get('/:language')
  @ApiOperation({
    description: '设置语言'
  })
  async setLanguage(@Param('language') language: string, @Res() res: Response) {
    res.cookie('language', language);
    res.end();
  }
}
