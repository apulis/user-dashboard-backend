import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';
import { Repository } from 'typeorm';

const mapUserIdsAndRoleIds = (userIds: number[], roleIds: number[]) => {
  const userRole: {userId: number; roleId: number}[] = [];
  roleIds.forEach(r => {
    userIds.forEach(u => {
      userRole.push({
        userId: u,
        roleId: r,
      })
    })
  })
  return userRole;
}


@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) { }

  async checkDuplicateItems(userNames: number[], roleNames: number[]) {
    const userRole = mapUserIdsAndRoleIds(userNames, roleNames);
    const result = await this.userRoleRepository
      .find({
        where: userRole
      });
    return result;
  }

  async addRoleToUser(userIds: number[], roleIds: number[]) {
    const userRole = mapUserIdsAndRoleIds(userIds, roleIds);
    return await this.userRoleRepository
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values(userRole)
      .execute()
  }

  async findUserRolesById(userId: number) {
    return await this.userRoleRepository
      .find({
        userId,
      })
  }

  async eidtUserRoles(userId: number, roleIds: number[]) {
    // 1. 删除数据库有但是roleIds没有的
    // 2. 增加以前没有的
    const userRoles = await this.findUserRolesById(userId);
    const dbRoleIds = userRoles.map(val => {
      return {
        roleId: val.roleId,
        id: val.id,
      }
    });
    const willDelete: number[] = [];
    const willInsert: number[] = [];
    dbRoleIds.forEach(r => {
      if (roleIds.includes(r.roleId)) {
        // 数据库有，roleIds也有的，不管
      } else {
        // 数据库有，roleIds 没有的，删除
        willDelete.push(r.id)
      }
    })
    roleIds.forEach(r => {
      if (dbRoleIds.find(v => v.roleId === r)) {
        // 数据库有，roleIds也有的，不管
      } else {
        // 数据库没有，roleIds 有的，新增
        willInsert.push(r)
      }
    })
    const removeItems = await this.userRoleRepository
      .findByIds(willDelete)
    this.userRoleRepository.remove(removeItems);
    await this.addRoleToUser([userId], willInsert);
  }
}
