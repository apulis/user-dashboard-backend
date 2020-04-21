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
    return await this.groupRepository
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values({
        ...groupInfo,
        createTime: new Date().getTime() + '',
      })
      .execute()
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
  
  async removeGroup(groupNames: string[]) {
    return await this.groupRepository
      .createQueryBuilder('group')
      .update(Group)
      .set({isDelete: 1})
      .where('group.name IN (:groupNames)', {
        groupNames: groupNames
      })
      .execute()
  }
}
