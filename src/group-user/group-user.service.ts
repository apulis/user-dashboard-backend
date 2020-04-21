import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupUser } from './group-user.entity';

const mapUserNamesAndGroupNames = (userNames: string[], groupNames: string[]) => {
  const groupUser: {userName: string; groupName: string}[] = [];
  groupNames.forEach(g => {
    userNames.forEach(u => {
      groupUser.push({
        userName: u,
        groupName: g,
      })
    })
  })
  return groupUser;
}

@Injectable()
export class GroupUserService {
  constructor(
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,
  ) { }

  async checkDuplicateItems(userNames: string[], groupNames: string[]) {
    const groupUser = mapUserNamesAndGroupNames(userNames, groupNames);
    const result = await this.groupUserRepository
      .find({
        where: groupUser
      });
    return result;
  }
   
  async addUsersToGroups(userNames: string[], groupNames: string[]) {
    const groupUser = mapUserNamesAndGroupNames(userNames, groupNames);
    return await this.groupUserRepository
      .createQueryBuilder()
      .insert()
      .into(GroupUser)
      .values(groupUser)
      .execute()

  }
}
