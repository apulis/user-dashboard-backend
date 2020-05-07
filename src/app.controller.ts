import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionService } from './permission/permission.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly permissionService: PermissionService
    ) {
    permissionService.initPermissions()
  }

  @Get('/')
  getHello(): object {
    return this.appService.getHello();
  }

}
