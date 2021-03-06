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
    }
    return this.groupRepository
      .findOne({
        name: groupInfo.name
      })

    
  }

  async getAllGroupCount(): Promise<number> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .getCount();
  }

  async getAllGroup(search?: string): Promise<IGroup[]> {
    if (!search) {
      return await this.groupRepository
      .createQueryBuilder('group')
      .select(['group.name', 'group.note', 'group.createTime', 'group.id'])
      .getMany();
    } else {
      const nameQuery = 'name LIKE :search';
      const noteQuery = 'note LIKE :search';
      return await this.groupRepository
        .createQueryBuilder('group')
        .select(['group.name', 'group.note', 'group.createTime', 'group.id'])
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
      .delete()
      .from(Group)
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

  async editGroupDetail(id: number, note: string, name: string) {
    const detail = await this.groupRepository.findOne(id);
    if (detail) {
      detail.name = name;
      detail.note = note;
      await this.groupRepository.save(detail);
    }
  }

  async getGroupInfos(groupIds: number[]) {
    return await this.groupRepository
      .createQueryBuilder('group')
      .select(['name', 'id', 'note'])
      .where("group.id IN (:groupIds)", { groupIds: groupIds })
      .execute()
  }

  async checkDupGroup(groupName: string, id?: number) {
    if (id) {
      return this.groupRepository.findOne({
        name: groupName,
        id,
      })
    } else {
      return this.groupRepository.findOne({
        name: groupName,
      })
    }
    
  }
}
