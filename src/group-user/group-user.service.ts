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

interface IUserGroup {
  userId: number;
  groupId: number;
}

@Injectable()
export class GroupUserService {
  constructor(
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,
  ) { }
  
  private removeDuplicatedItem(groupUser: IUserGroup[], duplicatedItem: IUserGroup[]) {
    const result = groupUser.filter(val => {
      if (!duplicatedItem.some(dup => dup.groupId === val.groupId && dup.userId === val.userId)) {
        return val;
      }

      return undefined
    })
    return result;
  }

  private async checkDuplicateItems(groupUser: IUserGroup[]) {
    const result = await this.groupUserRepository
      .find({
        where: groupUser
      });
    return result;
  }
   
  async addUsersToGroups(userIds: number[], groupIds: number[]) {
    let groupUser = mapUserIdsAndGroupIds(userIds, groupIds);
    const duplicatedItem = await this.checkDuplicateItems(groupUser);
    if (duplicatedItem.length > 0) {
      groupUser = this.removeDuplicatedItem(groupUser, duplicatedItem);
    }
    if (groupUser.length === 0) {
      return true;
    }
    return await this.groupUserRepository
      .createQueryBuilder()
      .insert()
      .into(GroupUser)
      .values(groupUser)
      .execute()

  }

  async getUsersByGroupId(groupId: number) {
    return await this.groupUserRepository
      .createQueryBuilder('group-user')
      .select(['group-user.userId'])
      .where('groupId = ' + groupId)
      .getMany()
  }

  async getGroupsByUserId(userId: number) {
    return await this.groupUserRepository
      .createQueryBuilder('group-user')
      .select(['group-user.groupId'])
      .where('userId = ' + userId)
      .getMany()
  }

  async removeGroupForUser(groupId: number, userId: number): Promise<boolean> {
    const deleteItem = await this.groupUserRepository.findOne({
      groupId,
      userId
    })
    if (deleteItem) {
      await this.groupUserRepository.remove(deleteItem);
      return true
    }
    return false
  }
}
