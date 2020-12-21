import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, InsertResult } from 'typeorm';

import { Role } from './role.entity';
import { initialRole } from 'db-init/init-role';
import { CasbinService, CASBIN_ENFORCER } from 'src/common/authz';
import { Enforcer } from 'casbin';


interface ICreateRole {
  name: string;
  note: string;
  createTime?: string;
  permissions?: string[]
}

interface IGetRoleList {
  list: ICreateRole[];
  total: number;
}


const nameQuery = 'name LIKE :search';
const noteQuery = 'note LIKE :search'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly casbinService: CasbinService,
  ) { }

  public async initDbRoles() {
    const roles = initialRole;
    await this.roleRepository.save(roles);
  }

  public async checkDupItem(roleName: string) {
    const role = this.roleRepository.findOne({
      name: roleName
    })
    return role;
  }

  public async getRoleCount(search?: string) {
    if (!search) {
      return await this.roleRepository
        .createQueryBuilder('role')
        .getCount();
    } else {
      search = `%${search}%`;
      return await this.roleRepository
        .createQueryBuilder('role')
        .andWhere(new Brackets(subQuery => {
          return subQuery
            .where(nameQuery)
            .orWhere(noteQuery)
        }))
        .setParameters(
          { search: search }
        )
        .getCount()
    }
  }

  public async getRoleList(pageNo: number, pageSize: number, search?: string): Promise<IGetRoleList> {
    if (search) {
      const list = await this.roleRepository
        .createQueryBuilder('role')
        .select(['role.id', 'role.name', 'role.createTime', 'role.isPreset', 'role.note'])
        .andWhere(new Brackets(subQuery => {
          return subQuery
            .where(nameQuery)
            .orWhere(noteQuery)
        }))
        .setParameters(
          { search: `%${search}%` }
        )
        .skip(pageNo)
        .take(pageSize)
        .getMany();
      const total = await this.getRoleCount(search);
      return {
        total,
        list,
      }
      
    } else {
      const list = await this.roleRepository
        .createQueryBuilder('role')
        .select(['role.id', 'role.name', 'role.createTime', 'role.isPreset', 'role.note'])
        .skip(pageNo)
        .take(pageSize)
        .getMany();
      const total = await this.getRoleCount();
      return {
        list,
        total,
      }
    }
  }

  public async createRole(role: ICreateRole): Promise<any> {
    role.createTime = new Date().getTime() + '';
    const result = await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(role)
      .execute();
    const roleId = result.identifiers[0].id;
    if (role.permissions) {
      await this.casbinService.addPermissionForRole(roleId, role.permissions);
    }
  }

  public async removeRoles(roleIds: number[]) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .delete()
      .from(Role)
      .where('role.id IN (:roleIds)', {
        roleIds: roleIds
      })
      .execute()
  }
  
  public async getRolesByRoleIds(roleIds: number[]) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .select(['name', 'id', 'note', 'isPreset'])
      .where("role.id IN (:roleIds)", { roleIds: roleIds })
      .execute()
  }

  public async getRoleByRoleName(roleName: string) {
    return await this.roleRepository
      .findOne({
        name: roleName
      });
    }
  
  public async getRoleDetail(roleId: number) {
    return await this.roleRepository.findOne({
      id: roleId,
    })
  }

}
