import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { initialPermissions } from 'mysql-init/init-permission';

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
    const permissions = initialPermissions.map(val => {
      return {
        name: val.name,
        key: val.key,
        note: val.note,
        project: val.project,
      }
    })
    for await (const p of permissions) {
      const result = await this.permissionRepository.findOne({
        key: p.key
      })
      if (result) {
        // update
        result.name = p.name;
        result.note = p.note;
        result.project = p.project;
        this.permissionRepository.save(result);
      }
    }
  }

}
