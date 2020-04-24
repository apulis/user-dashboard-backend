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


@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) { }

  async checkDuplicateItems(roleIds: number[], groupIds: number[]) {
    const groupRole = mapUserIdsAndGroupIds(roleIds, groupIds);
    const result = await this.groupRoleRepository
      .find({
        where: groupRole
      });
    return result;
  }

  async addRoleToGroup(roleIds: number[], groupIds: number[]) {
    const groupRole = mapUserIdsAndGroupIds(roleIds, groupIds);
    return await this.groupRoleRepository
      .createQueryBuilder()
      .insert()
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

}
