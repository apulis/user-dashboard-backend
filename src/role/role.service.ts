import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';

import { Role } from './role.entity';


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
  ) { }

  public async getRoleCount(search?: string) {
    if (!search) {
      return await this.roleRepository
        .createQueryBuilder('role')
        .where('isDelete != 1')
        .getCount();
    } else {
      search = `%${search}%`;
      return await this.roleRepository
        .createQueryBuilder('role')
        .where('isDelete != 1')
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
        .where('isDelete != 1')
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
        .where('isDelete != 1')
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

  public async createRole(role: ICreateRole) {
    role.createTime = new Date().getTime() + '';
    return await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(role)
      .execute()
  }
}
