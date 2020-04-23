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
}
