import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets } from 'typeorm';

import { Group } from './group.entity';
import { ICreateGroup } from './group.controller';

interface IGroup {
  name: string;
  note: string;
}

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) { }

  async createGroup(groupInfo: ICreateGroup) {
    // 如果之前有这个名称，那么去更新 isDelete 状态
    const result = await this.groupRepository
      .findOne({
        name: groupInfo.name
      })
    if (!result) {
      await this.groupRepository
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values({
        ...groupInfo,
        createTime: new Date().getTime() + '',
      })
      .execute()
    } else {
      result.isDelete = 0;
      result.createTime = new Date().getTime() + '';
      result.note = groupInfo.note;
      await this.groupRepository.save(result);
    }
    return this.groupRepository
      .findOne({
        name: groupInfo.name
      })

    
  }

  async getAllGroupCount(): Promise<number> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .where('isDelete != 1')
      .getCount();
  }

  async getAllGroup(search?: string): Promise<IGroup[]> {
    if (!search) {
      return await this.groupRepository
      .createQueryBuilder('group')
      .select(['group.name', 'group.note', 'group.createTime', 'group.id'])
      .where('isDelete != 1')
      .getMany();
    } else {
      const nameQuery = 'name LIKE :search';
      const noteQuery = 'note LIKE :search';
      return await this.groupRepository
        .createQueryBuilder('group')
        .select(['group.name', 'group.note', 'group.createTime', 'group.id'])
        .where('isDelete != 1')
        .andWhere(new Brackets(subQuery => {
          return subQuery
            .where(nameQuery)
            .orWhere(noteQuery)
        }))
        .setParameters(
          {search: '%' + search + '%'}
        )
        .getMany();
    }
    
  }
  
  async removeGroup(groupIds: number[]) {
    return await this.groupRepository
      .createQueryBuilder('group')
      .update(Group)
      .set({isDelete: 1})
      .where('group.id IN (:groupIds)', {
        groupIds: groupIds
      })
      .execute()
  }

  async getGroupDetail(id: number) {
    return await this.groupRepository
      .findOne({
        id: id  
      })
  }
}
