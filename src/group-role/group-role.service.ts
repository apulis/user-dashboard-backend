import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRole } from './group-role.entity';
import { Repository } from 'typeorm';

const mapUserIdsAndGroupIds = (roleNames: number[], groupNames: number[]) => {
  const groupRole: {roleId: number; groupId: number}[] = [];
  groupNames.forEach(g => {
    roleNames.forEach(u => {
      groupRole.push({
        roleId: u,
        groupId: g,
      })
    })
  })
  return groupRole;
}

interface IGroupRole {
  roleId: number;
  groupId: number;
}

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) { }

  async checkDuplicateItems(groupRole: IGroupRole[]) {
    const result = await this.groupRoleRepository
      .find({
        where: groupRole
      });
    return result;
  }

  private removeDuplicatedItem(groupRole: IGroupRole[], duplicatedItem: IGroupRole[]): IGroupRole[] {
    const result = groupRole.filter(val => {
      if (!duplicatedItem.some(dup => dup.groupId === val.groupId && dup.roleId === val.roleId)) {
        return val;
      }
      return undefined
    })
    return result;
  }

  async addRoleToGroup(roleIds: number[], groupIds: number[]) {
    let groupRole = mapUserIdsAndGroupIds(roleIds, groupIds);
    return await this.groupRoleRepository
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(GroupRole)
      .values(groupRole)
      .execute()
  }

  async getRolesById(groupId: number) {
    return await this.groupRoleRepository
      .createQueryBuilder('group-role')
      .select(['group-role.roleId'])
      .where('groupId = ' + groupId)
      .getMany()
  }

  async removeRoleForGroup(groupId: number, roleId: number) {
    const removeItem = await this.groupRoleRepository
      .findOne({
        groupId,
        roleId,
      });
    if (removeItem) {
      this.groupRoleRepository.remove(removeItem);
    }
  }
}
