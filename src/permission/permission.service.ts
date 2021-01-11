import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { initialPermissions, ProjectTypes, cnProjectTypes, enProjectTypes, enNames } from 'db-init/init-permission';
import { cnNames } from 'db-init/init-permission';
import { contentSecurityPolicy } from 'helmet';
import { ConfigService } from 'config/config.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>, 
    private readonly configService: ConfigService
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
      // throw new Error('permission key duplicate, please check');
      const current: Permission[] = [];
      initialPermissions.forEach(val => {
        if (!current.find(c => c.key === val.key)) {
          current.push(val);
        }
      })
    } else {
      // await this.permissionRepository.save(initialPermissions);
      await this.permissionRepository
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(Permission)
      .values(initialPermissions)
      .execute();
    }
  }

  public async getAppPermissions() {
    let permissions = JSON.parse(JSON.stringify(initialPermissions)) as Permission[];
    permissions.forEach(p => {
      Object.keys(enNames).forEach(key => {
        if (key === p.key) {
          p.name = enNames[key];
        }
      })
    });
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
    let permissions = JSON.parse(JSON.stringify(initialPermissions)) as Permission[];
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
