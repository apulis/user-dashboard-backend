import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupUser } from './group-user.entity';

const mapUserIdsAndGroupIds = (userIds: number[], groupIds: number[]) => {
  const groupUser: {userId: number; groupId: number}[] = [];
  groupIds.forEach(g => {
    userIds.forEach(u => {
      groupUser.push({
        userId: u,
        groupId: g,
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

  async checkDuplicateItems(userIds: number[], groupIds: number[]) {
    const groupUser = mapUserIdsAndGroupIds(userIds, groupIds);
    const result = await this.groupUserRepository
      .find({
        where: groupUser
      });
    return result;
  }
   
  async addUsersToGroups(userIds: number[], groupIds: number[]) {
    const groupUser = mapUserIdsAndGroupIds(userIds, groupIds);
    return await this.groupUserRepository
      .createQueryBuilder()
      .insert()
      .into(GroupUser)
      .values(groupUser)
      .execute()

  }
}
