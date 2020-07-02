import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { initialPermissions, ProjectTypes, cnProjectTypes, enProjectTypes } from 'mysql-init/init-permission';
import { cnNames } from 'mysql-init/init-permission';
import { contentSecurityPolicy } from 'helmet';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>, 
  ) { }

  private checkPermissionKeyUnique(permissions: Permission[]) {
    const keys = permissions.map(val => val.key);
    let repeatKeys: string[] = [];
    keys.forEach(function(elem){
      if (keys.indexOf(elem) !== keys.lastIndexOf(elem) && repeatKeys.indexOf(elem) === -1){
        repeatKeys.push(elem);
      }
    })
    return repeatKeys;
  }

  public async initPermissions() {
    if (this.checkPermissionKeyUnique(initialPermissions).length > 0) {
      throw new Error('permission key duplicate, please check');
    }
    await this.permissionRepository.save(initialPermissions)
  }

  public async getAppPermissions() {
    const permissions = await this.permissionRepository.find();
    permissions.forEach(p => {
      Object.keys(ProjectTypes).forEach(pt => {
        if (p.project === pt) {
          p.project = enProjectTypes[pt];
        }
      })
    })
    return permissions;
  }
  public async getAppCNPermissions() {
    const permissions = await this.permissionRepository.find();
    permissions.forEach(p => {
      Object.keys(cnNames).forEach(key => {
        if (key === p.key) {
          p.name = cnNames[key];
        }
      })
    });
    permissions.forEach(p => {
      Object.keys(ProjectTypes).forEach(pt => {
        if (p.project === pt) {
          p.project = cnProjectTypes[pt];
        }
      })
    })
    return permissions;
  }
}
