import { Injectable, Inject } from '@nestjs/common';
import { CASBIN_ENFORCER, TypesPrefix } from 'src/common/authz';
import { Enforcer } from 'casbin';
import axios from 'axios';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';

export const initialVCName = 'platform';

@Injectable()
export class UserVcService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
    private readonly config: ConfigService,
    private readonly userService: UserService
  ) { }

  public async listVcNamesForUser(userId: number) {
    let vcPolicys = await this.enforcer.getPermissionsForUser(TypesPrefix.user + userId)
    const vcNames: string[] = []
    vcPolicys.forEach(p => {
      if (p && (p[1] === TypesPrefix.vc)) {
        vcNames.push(p[2]);
      }
    })
    return vcNames;
  }
  public async listVcForUser(userId: number) {
    let vcPolicys = await this.enforcer.getPermissionsForUser(TypesPrefix.user + userId)
    const vcNames: string[] = []
    vcPolicys.forEach(p => {
      if (p && (p[1] === TypesPrefix.vc)) {
        vcNames.push(p[2]);
      }
    })
    let allVc = await this.fetchAllVC();
    allVc = allVc.filter(val => {
      return vcNames.includes(val.vcName);
    })
    return allVc;
  
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

  public async fetchAllVC() {
    const RESTFULAPI = this.config.get('RESTFULAPI');
    const res = await axios.get(RESTFULAPI + '/ListVCs');
    if (res.data.result) {
      return (res.data.result as {vcName: string, [propsName: string]: any}[]);
    }
    return []
  }

  public async addPlatFormVCForAdminUsers() {
    const adminUserNames: string[] = JSON.parse(this.config.get('ADMINISTRATOR_USER_NAME'));
    const userIds = await this.userService.getUserIdsByUserNames(adminUserNames);
    userIds.forEach(val => {
      const userId = TypesPrefix.user + val.id;
      this.enforcer.addPermissionForUser(userId, TypesPrefix.vc, initialVCName)
    })
  }

}
