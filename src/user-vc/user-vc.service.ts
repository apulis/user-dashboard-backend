import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CASBIN_ENFORCER, TypesPrefix } from 'src/common/authz';
import { Enforcer } from 'casbin';
import axios from 'axios';
import { ConfigService } from 'config/config.service';
import { UserService } from 'src/user/user.service';
import { Cache } from 'cache-manager';
import { ttl } from 'src/common/cache-manager';

export const initialVCName = 'platform';
export const allVCListTag = 'allVCList';

@Injectable()
export class UserVcService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject('REDIS_MANAGER') private readonly redisCache: Cache
  ) { }

  public async getUserVcDetail(userId: number, pageNo: number, pageSize: number) {
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
    return {
      list: allVc.slice(pageNo * pageSize, pageSize),
      total: allVc.length,
    }
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
    const memoAllVCList = await this.redisCache.get(allVCListTag)
    let allVc = {}
    if (!memoAllVCList) {
      const RESTFULAPI = this.config.get('RESTFULAPI');
      const res = await axios.get(RESTFULAPI + '/ListVCs');
      if (res.data.result) {
        allVc = res.data.result;
        this.redisCache.set(allVCListTag, JSON.stringify(allVc), { ttl: 3 })
      }
    } else {
      allVc = JSON.parse(memoAllVCList);
    }
    return allVc as {vcName: string, [props: string]: any}[];
  }

  public async searchVC(pageNo?: number, pageSize?: number, search?: string) {
    let allVc = {}
    const params = {
      page: pageNo,
      size: pageSize,
      name: search,
    }
    const RESTFULAPI = this.config.get('RESTFULAPI');
    const res = await axios.get(RESTFULAPI + '/ListVCs', {
      params,
    });
    if (res.data.result) {
      allVc = {list: res.data.result, total: res.data.totalNum };
    }
    return allVc
    
  }

  public async addPlatFormVCForAdminUsers() {
    const adminUserNames: string[] = JSON.parse(this.config.get('ADMINISTRATOR_USER_NAME'));
    const userIds = await this.userService.getUserIdsByUserNames(adminUserNames);
    userIds.forEach(val => {
      const userId = TypesPrefix.user + val.id;
      this.enforcer.addPermissionForUser(userId, TypesPrefix.vc, initialVCName)
    })
  }

  public async getAllVCUserCount() {
    const result: {[props: string]: number} = {};

    const vcPolicys = await this.enforcer.getFilteredNamedPolicy('p', 0, '', TypesPrefix.vc);
    vcPolicys.forEach(p => {
      const vc = p[2];
      if (typeof result[vc] === 'undefined') {
        result[vc] = 1;
      } else {
        result[vc] += 1;
      }
    })
    return result;
  }

  public async getUserVcNames(userId: number) {

    let vcPolicys = await this.enforcer.getPermissionsForUser(TypesPrefix.user + userId)
    const vcNames: string[] = []
    vcPolicys.forEach(p => {
      if (p && (p[1] === TypesPrefix.vc)) {
        vcNames.push(p[2]);
      }
    })
    return vcNames;
  
  }

}
