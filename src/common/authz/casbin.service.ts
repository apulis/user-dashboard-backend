import { Inject, Injectable, Scope } from "@nestjs/common";
import { Enforcer } from "casbin";
import { CASBIN_ENFORCER } from "./casbin.constants";
import { initialPermissions, EnumPermissionKeys } from "mysql-init/init-permission";

export enum TypesPrefix {
  user = 'user:',
  role = 'role:',
  group = 'group:',
}

@Injectable()
export class CasbinService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer) {}

  public async addPermissionForRole(roleId: number, permissionKey: string | string[]) {
    if (Array.isArray(permissionKey)) {
      for await (const key of permissionKey) {
        await this.enforcer.addPermissionForUser(TypesPrefix.role + roleId, key);
      }
      return permissionKey;
    } else {
      return await this.enforcer.addPermissionForUser(TypesPrefix.role + roleId, permissionKey);
    }
  }

  public async hasPermissionForRole(roleId: number, permissionKey: string) {
    return await this.enforcer.hasPermissionForUser(TypesPrefix.role + roleId, permissionKey);
  }

  public async getPermissionForRole(roleId: number) {
    const rolePermissions = await this.enforcer.getPermissionsForUser(TypesPrefix.role + roleId);
    return rolePermissions;
  }

  public initRolePermissions() {
    // admin
    this.addPermissionForRole(1, initialPermissions.map(val => val.key));
    // user
    this.addPermissionForRole(2, EnumPermissionKeys.SUBMIT_TRAINING_JOB);
    this.addPermissionForRole(2, EnumPermissionKeys.VIEW_ALL_USER_JOB);
    this.addPermissionForRole(2, EnumPermissionKeys.VIEW_CLUSTER_STATUS);
    this.addPermissionForRole(2, EnumPermissionKeys.USE_VC);
  }
}
