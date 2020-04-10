import { Controller, UseGuards, Get } from '@nestjs/common';
import { RoleService } from './role.service';


@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/list')
  getRoleList() {
    return this.roleService.getRoleList();
  }

}
