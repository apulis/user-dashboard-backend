import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';
import { CasbinService } from './common/authz';
import { initialPermissions } from 'mysql-init/init-permission';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly casbinService: CasbinService,
    ) {
    Promise.all([
      permissionService.initPermissions(),
      roleService.initDbRoles(),
    ])
    .then(() => {
      casbinService.initRolePermissions();
    })
  }

  @Get('/')
  getHello(): object {
    return this.appService.getHello();
  }

}
