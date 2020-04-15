import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Res } from '@nestjs/common';
import { IUserMessage } from './user.controller';

import { RegisterTypes } from 'src/config/enums'

interface ICreateUser extends IUserMessage {
  createTime: string;
  openId: string;
  registerType: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async find(pageNo: number, pageSize: number): Promise<{list: User[], total: number}> {
    const total = await this.usersRepository.count();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note'])
      .where('isDelete != 1')
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

  async remove() {
    
  }
  
}