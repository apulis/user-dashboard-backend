import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';
import { CasbinService } from './common/authz';
import { UserService } from './user/user.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly casbinService: CasbinService,
    private readonly userService: UserService
    ) {
    Promise.all([
      permissionService.initPermissions(),
      roleService.initDbRoles(),
      userService.initFirstUser()
    ])
    .then(async() => {
      casbinService.initRolePermissions();
    })
  }

}
