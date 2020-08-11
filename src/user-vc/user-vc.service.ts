import { Injectable, Inject } from '@nestjs/common';
import { CASBIN_ENFORCER, TypesPrefix } from 'src/common/authz';
import { Enforcer } from 'casbin';

@Injectable()
export class UserVcService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer
  ) { }

  public async listVcForUser(userId: number) {
    let vcPolicys = await this.enforcer.getPermissionsForUser(TypesPrefix.user + userId)
    const vcNames: string[] = []
    vcPolicys.forEach(p => {
      if (p && (p[1] === TypesPrefix.vc)) {
        vcNames.push(p[2]);
      }
    })
    console.log('vcNames', vcNames)
    return vcNames;
  }

  public async modifyUserVc(userId: string, vcNames: string[]) {
    userId = TypesPrefix.user + userId;
    vcNames.forEach((vcName) => {
      this.enforcer.addPermissionForUser(userId, TypesPrefix.vc, vcName)
    })
    const existed = await this.enforcer.getPermissionsForUser(userId);
    const existedVC = existed.map(e => {
      return e[2];
    })
    const deleteItems = this.findToDeleteItems(existedVC, vcNames);
    for (const item of deleteItems) {
      await this.enforcer.deletePermissionForUser(userId, TypesPrefix.vc, item);
    }
    return true;
    
  }

  public async getVCUserCount(vcName: string) {
    const result = await this.enforcer.getFilteredNamedPolicy('p', 0, '', TypesPrefix.vc, vcName);
    return result.length;
  }

  public async removeAllVCPolicy(vcName: string) {
    return await this.enforcer.removeFilteredNamedPolicy('p', 0, '', TypesPrefix.vc, vcName)
  }

  public async removeUserForVC(userId: number) {
    return await this.enforcer.removeFilteredNamedPolicy('p', 0, TypesPrefix.user + userId, TypesPrefix.vc, '');
  }

  private findToDeleteItems(arr1: string[], arr2: string[]) {
    const result: string[] = []
    arr1.forEach(val => {
      if (!arr2.includes(val)) {
        result.push(val)
      }
    })
    return result;
  }

}
