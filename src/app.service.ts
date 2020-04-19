import { Injectable, Inject } from '@nestjs/common';
import { Enforcer, DefaultRoleManager } from "casbin";
import {CASBIN_ENFORCER, CASBIN_ROLE_MANAGER, CasbinService} from 'src/common/authz/index'

@Injectable()
export class AppService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
    @Inject(CASBIN_ROLE_MANAGER) private readonly roleManager: DefaultRoleManager,
    private readonly casbinService: CasbinService
  ) {}
  async getHello(): Promise<object> {
    console.log(await this.enforcer.addPermissionForUser('role_hanxjz', '/abc', 'write'))
    console.log(await this.enforcer.deletePermissionForUser('role_hanxjz', '/abc', 'write'))
    console.log(await this.enforcer.getPermissionsForUser('role_hanxjz'))
    return { a: 'b' };
  }
}
