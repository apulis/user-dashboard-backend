
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Res } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { IUserMessage } from './user.controller';

import { RegisterTypes } from 'src/config/enums'
import { User } from './user.entity';
import { UserRole } from 'src/user-role/user-role.entity';

interface ICreateUser extends IUserMessage {
  createTime: string;
  openId: string;
  registerType: string;
}

const userNameQuery = 'userName LIKE :search';
const nickNameQuery = 'nickName LIKE :search';
const emailQuery = 'email LIKE :search';
const noteQuery = 'note LIKE :search';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async getUserCount(): Promise<number> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('isDelete != 1')
      .getCount();
  }

  async find(pageNo: number, pageSize: number): Promise<{list: User[], total: number}> {
    const total = await this.getUserCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id'])
      .where('isDelete != 1')
      .skip(pageNo * pageSize)
      .take(pageSize)
      .getMany();
    return {
      list,
      total
    };
  }

  async findAll() {
    const total = await this.getUserCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.id', 'user.nickName', 'user.phone', 'user.email', 'user.note'])
      .where('isDelete != 1')
      .getMany();
    return {
      list,
      total
    };
  }

  async findAllLike(search?: string) {
    search = '%' + search + '%';
    const total = await this.usersRepository
      .createQueryBuilder('user')
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
      }))
      .setParameters(
        {search: search}
      )
      .getCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id'])
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
          .orWhere(emailQuery)
          .orWhere(noteQuery)
      }))
      .setParameters(
        {search: search}
      )
      .getMany();
    return {
      list,
      total
    };
  }

  async findLike(pageNo: number, pageSize: number, search: string): Promise<{list: User[], total: number}> {
    
    search = '%' + search + '%';
    const total = await this.usersRepository
      .createQueryBuilder('user')
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
      }))
      .setParameters(
        {search: search}
      )
      .getCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id'])
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
          .orWhere(emailQuery)
          .orWhere(noteQuery)
      }))
      .setParameters(
        {search: search}
      )
      .skip(pageNo * pageSize)
      .take(pageSize)
      .getMany();
    return {
      list,
      total
    };
  }
  
  async userNameUnique(userName: string[]) {
    return await this.usersRepository
      .createQueryBuilder()
      .select('userName')
      .where("user.userName IN (:...names)", { names: userName })
      .execute()
  }

  async create(users: IUserMessage[]): Promise<any> {
    const newUsers: ICreateUser[] = [];
    users.forEach(u => {
      // TODO: encode u.password
      newUsers.push({
        ...u,
        openId: u.userName,
        registerType: RegisterTypes.Account,
        createTime: new Date().getTime() + '',
      })
    });
    return await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(newUsers)
      .execute();

  }

  async remove(userNames: string[]): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .update(User)
      .set({isDelete: 1})
      .where('user.userName IN (:userNames)', {
        userNames: userNames
      })
      .execute()
  }

  async findUserByUserNames(userNames: string[]): Promise<any[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['userName', 'id'])
      .where("user.userName IN (:userNames)", { userNames: userNames })
      .execute()
  }

  async findUsersByUserIds(userIds: number[]): Promise<any[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['*'])
      .where("user.id IN (:userIds)", { userIds: userIds })
      .execute()
  }
}