import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IUserMessage } from './user.controller';

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

  async find(pageNo: number, pageSize: number): Promise<User[]> {
    return await this.usersRepository.createQueryBuilder('user').skip(pageNo).take(pageSize).getMany();
  }

  async create(users: IUserMessage[]): Promise<any> {
    const newUsers: ICreateUser[] = [];
    users.forEach(u => {
      // TODO: encode u.password
      newUsers.push({
        ...u,
        openId: u.userName,
        registerType: 'Account',
        createTime: new Date().getTime() + '',
      })
    })
    return await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(newUsers)
      .execute()

  }

  async remove() {
    
  }
  
}