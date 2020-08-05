import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';
import { Repository } from 'typeorm';
import { ConfigService } from 'config/config.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';

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

interface IUserRole {
  userId: number;
  roleId: number;
}


@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService
  ) { }

  private removeDuplicatedItems(userRole: IUserRole[], duplicatedItem: IUserRole[]) {
    const result = userRole.filter(val => {
      if (!duplicatedItem.some(dup => dup.userId === val.userId && dup.roleId === val.roleId)) {
        return val;
      }
      return undefined
    })
    return result;
  }

  async initAdminUserRole() {
    const adminUserNames: string[] = JSON.parse(this.configService.get('ADMINISTRATOR_USER_NAME'));
    const adminUserIds = await this.userService.getUserIdsByUserNames(adminUserNames);
    const adminRole = await this.roleService.getRolesByRoleIds([1]);
    if (adminRole) {
      return await this.addRoleToUser(adminUserIds.map(val => val.id), [adminRole[0].id]);
    }
    return true;
  }

  async checkDuplicateItems(userRole: IUserRole[]) {
    const result = await this.userRoleRepository
      .find({
        where: userRole
      });
    return result;
  }

  async addRoleToUser(userIds: number[], roleIds: number[]) {
    let userRole = mapUserIdsAndRoleIds(userIds, roleIds);
    return await this.userRoleRepository
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(UserRole)
      .values(userRole)
      .execute()
  }

  async findUserRoleIdsById(userId: number) {
    return await this.userRoleRepository
      .find({
        userId
      })
  }

  async eidtUserRoles(userId: number, roleIds: number[]) {
    // 1. 删除数据库有但是roleIds没有的
    // 2. 增加以前没有的
    const userRoles = await this.findUserRoleIdsById(userId);
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
    if (willDelete.length > 0) {
      const removeItems = await this.userRoleRepository
        .findByIds(willDelete);
      this.userRoleRepository.remove(removeItems);
    }
    if (willInsert.length > 0) {
      await this.addRoleToUser([userId], willInsert);
    }
  }

  async removeRoleForUser(userId: number, roleId: number): Promise<boolean> {
    const removeItem = await this.userRoleRepository.findOne({
      userId,
      roleId
    })
    if (removeItem) {
      await this.userRoleRepository.remove(removeItem);
      return true
    }
    return false;
  }

  async findUserIdByRoleId(roleId: number) {
    const userRole = await this.userRoleRepository.find({
      roleId,
    })
    return userRole.map(val => val.userId);
  }
}
