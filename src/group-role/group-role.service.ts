import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRole } from './group-role.entity';
import { Repository } from 'typeorm';
import { GroupController } from 'src/group/group.controller';

const mapUserNamesAndGroupNames = (roleNames: string[], groupNames: string[]) => {
  const groupRole: {roleName: string; groupName: string}[] = [];
  groupNames.forEach(g => {
    roleNames.forEach(u => {
      groupRole.push({
        roleName: u,
        groupName: g,
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

  async checkDuplicateItems(roleNames: string[], groupNames: string[]) {
    const groupRole = mapUserNamesAndGroupNames(roleNames, groupNames);
    const result = await this.groupRoleRepository
      .find({
        where: groupRole
      });
    return result;
  }

  async addRoleToGroup(roleNames: string[], groupNames: string[]) {
    const groupRole = mapUserNamesAndGroupNames(roleNames, groupNames);
    return await this.groupRoleRepository
      .createQueryBuilder()
      .insert()
      .into(GroupRole)
      .values(groupRole)
      .execute()
  }



}
