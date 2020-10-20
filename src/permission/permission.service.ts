import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { initialPermissions, ProjectTypes, cnProjectTypes, enProjectTypes } from 'db-init/init-permission';
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
      throw new Error('permission key duplicate, please check');
    }
    await this.permissionRepository.save(initialPermissions)
  }

  public async getAppPermissions() {
    let permissions = await this.permissionRepository.find();
    permissions.forEach(p => {
      Object.keys(ProjectTypes).forEach(pt => {
        if (p.project === pt) {
          p.project = enProjectTypes[pt];
        }
      })
    })
    if (this.configService.i18n() === 'zh-CN') {
      // 暂时去除专家系统
      permissions = permissions.filter(val => {
        return val.project !== '依瞳平台'
      })
    }
    if (this.configService.i18n() === true) {
      permissions = permissions.filter(val => {
        return val.project !== '标注平台'
      })
      permissions = permissions.filter(val => {
        return val.project !== 'LABELING_PLATFORM'
      })
      permissions = permissions.filter(val => {
        return val.project !== this.configService.get('PLATFORM_NAME')
      })
    }
    return permissions;
  }
  public async getAppCNPermissions() {
    let permissions = await this.permissionRepository.find();
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
    if (this.configService.i18n() === 'zh-CN') {
      // 暂时去除专家系统
      permissions = permissions.filter(val => {
        return val.project !== '依瞳平台'
      })
    }
    if (this.configService.i18n() === true) {
      permissions = permissions.filter(val => {
        return val.project !== '标注平台'
      })
      permissions = permissions.filter(val => {
        return val.project !== this.configService.get('PLATFORM_NAME')
      })
    }
    
    return permissions;
  }
}
