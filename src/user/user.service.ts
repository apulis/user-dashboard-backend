
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Injectable, Res, Inject, forwardRef } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { IUserMessage } from './user.controller';
import { ResetPassword } from './reset-password.entity';

import { RegisterTypes } from 'src/constants/enums'
import { User } from './user.entity';
import { ConfigService } from 'config/config.service';
import { encodePassword, md5 } from 'src/utils';
import axios from 'axios';
import { UserVcService } from 'src/user-vc/user-vc.service';
import { Cache } from 'cache-manager'
import { TypesPrefix } from 'src/common/authz';
import { ttl } from 'src/common/cache-manager';
import { UserInfo } from 'os';

export interface IRequestUser extends User {
  currentRole: string[];
  permissionList: string[];
  currentVC?: string[]
}

export const openRegisterTypes = {
  Microsoft: 3001,
  Wechat: 3003,
  Account: 3005,
}

interface ICreateUser extends IUserMessage {
  createTime: string;
  openId: string;
  registerType: string;
}

const userNameQuery = 'userName LIKE :search';
const nickNameQuery = 'nickName LIKE :search';
const emailQuery = 'email LIKE :search';
const noteQuery = 'note LIKE :search';
const phoneQuery = 'phone LIKE :search';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(User) private readonly resetPasswordRepository: Repository<ResetPassword>,
    @Inject(forwardRef(() => UserVcService)) private readonly userVcService: UserVcService,
    private readonly config: ConfigService,
    @Inject('REDIS_MANAGER') private readonly redisCache: Cache,
  ) { }

  async getUserCount(): Promise<number> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('isDelete != 1')
      .getCount();
  }

  async initAdminUser() {
    const adminUserNames: string[] = JSON.parse(this.config.get('ADMINISTRATOR_USER_NAME'));
    const adminPassword = this.config.get('ADMINISTRATOR_PASSWORD');
    const adminUsers: {
      userName: string,
      password: string,
      createTime: string,
      id?: number;
    }[] = [];
    // 先 md5 一次，模拟客户端加密过程
    const encodedPassword = encodePassword(md5(adminPassword), this.config.get('SECRET_KEY'));
    adminUserNames.forEach(u => {
      adminUsers.push({
        userName: u,
        password: encodedPassword,
        createTime: new Date().getTime() + '',
      });
    });
    adminUsers[0].id = 30001;
    for await (const user of adminUsers) {
      await this.usersRepository
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .into(User)
        .values(user)
        .execute();
    }

    return true;
  }

  async find(pageNo: number, pageSize: number): Promise<{ list: User[], total: number }> {
    const total = await this.getUserCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id', 'user.jobMaxTimeSecond'])
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
          .orWhere(emailQuery)
          .orWhere(phoneQuery)
      }))
      .setParameters(
        { search: search }
      )
      .getCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id', 'user.jobMaxTimeSecond'])
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
          .orWhere(emailQuery)
          .orWhere(phoneQuery)
      }))
      .setParameters(
        { search: search }
      )
      .getMany();
    return {
      list,
      total
    };
  }

  async findLike(pageNo: number, pageSize: number, search: string): Promise<{ list: User[], total: number }> {

    search = '%' + search + '%';
    const total = await this.usersRepository
      .createQueryBuilder('user')
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
          .orWhere(emailQuery)
          .orWhere(phoneQuery)
      }))
      .setParameters(
        { search: search }
      )
      .getCount();
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.nickName', 'user.phone', 'user.email', 'user.note', 'user.id', 'user.jobMaxTimeSecond'])
      .where('isDelete != 1')
      .andWhere(new Brackets(subQuery => {
        return subQuery
          .where(userNameQuery)
          .orWhere(nickNameQuery)
          .orWhere(emailQuery)
          .orWhere(phoneQuery)
      }))
      .setParameters(
        { search: search }
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
      .where("userName IN (:...names)", { names: userName })
      .execute()
  }

  async create(users: IUserMessage[]): Promise<any> {
    const newUsers: ICreateUser[] = [];
    const SECRET_KEY = this.config.get('SECRET_KEY');
    users.forEach(u => {
      u.password = encodePassword(u.password, SECRET_KEY);
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

  async remove(userNames: string[], userIds: number[]) {
    const result = await Promise.all(userNames.map(async userName => {
      return await this.checkUserActiveJobs(userName)
    }));
    if (result.includes(true)) {
      const activeJobUserName: string[] = []
      result.forEach((r, index) => {
        if (r) {
          activeJobUserName.push(userNames[index]);
        }
      })
      return {
        success: false,
        activeJobUserName: activeJobUserName,
        message: 'User ' + activeJobUserName.join(', ') + ' has active job, please confirm!'
      }
    }
    userIds.forEach(uid => {
      this.userVcService.removeUserPolicys(uid)
    })
    await this.usersRepository
      .createQueryBuilder('user')
      .delete()
      .where('user.id IN (:userIds)', {
        userIds: userIds
      })
      .execute()
    return {
      success: true
    }
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
      .select(['userName', 'id', 'nickName', 'email', 'openId', 'note', 'phone'])
      .where("user.id IN (:userIds)", { userIds: userIds })
      .execute()
  }

  async getUserById(id: number) {
    return await this.usersRepository.find({
      id
    })
  }

  async editUserDetail(id: number, email: string, phone: string, note: string, nickName: string) {
    const detail = await this.usersRepository.findOne(id);
    if (detail) {
      detail.nickName = nickName;
      detail.note = note;
      detail.phone = phone;
      detail.email = email;
      await this.usersRepository.save(detail);
    }
  }

  async getMSUserInfoByOpenId(openId: string, nickName: string, registerType: string): Promise<{ id: number, userName: undefined } | User> {
    const user = await this.usersRepository.findOne({
      microsoftId: openId,
    });
    if (!user) {
      const result = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          nickName,
          openId,
          registerType,
          createTime: new Date().getTime() + '',
          microsoftId: openId,
          email: openId,
        })
        .execute();
      const id = result.generatedMaps[0].id;
      return { id, userName: undefined };
    } else {
      return user;
    }
  }
  async getWXUserInfoByOpenId(openId: string, nickName: string, registerType: string): Promise<{ id: number, userName: undefined } | User> {
    const user = await this.usersRepository.findOne({
      wechatId: openId,
    });
    if (!user) {
      const result = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          nickName,
          openId,
          registerType,
          createTime: new Date().getTime() + '',
          wechatId: openId,
        })
        .execute()
      const id = result.generatedMaps[0].id;
      return { id, userName: undefined };
    } else {
      return user;
    }
  }

  async signUpByMicrosoftId(microsoftId: string, userInfo: { userName: string, password: string, nickName: string }) {
    const user = await this.usersRepository.findOne({
      microsoftId
    })
    if (user) {
      const SECRET_KEY = this.config.get('SECRET_KEY');
      user.nickName = userInfo.nickName;
      user.password = encodePassword(userInfo.password, SECRET_KEY);
      user.userName = userInfo.userName;
      await this.usersRepository.save(user);
    }
  }
  async signUpByWechatId(wechatId: string, userInfo: { userName: string, password: string, nickName: string }) {
    const user = await this.usersRepository.findOne({
      wechatId
    })
    if (user) {
      const SECRET_KEY = this.config.get('SECRET_KEY');
      user.nickName = userInfo.nickName;
      user.password = encodePassword(userInfo.password, SECRET_KEY);
      user.userName = userInfo.userName;
      await this.usersRepository.save(user);
    }
  }

  async updateUserMicrosoftId(userId: number, microsoftId: string): Promise<void | User> {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      user.microsoftId = microsoftId;
      await this.usersRepository.save(user);
      return user;
    }
  }

  async updateUserWechatId(userId: number, wechatId: string): Promise<void | User> {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      user.wechatId = wechatId;
      await this.usersRepository.save(user);
      return user;
    }
  }

  async getUserIdsByUserNames(userNames: string[]): Promise<{ id: number }[]> {
    return await this.usersRepository
      .createQueryBuilder()
      .select('id')
      .where("userName IN (:...names)", { names: userNames })
      .execute()
  }

  async openFindAll() {
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userName', 'user.id', 'user.registerType'])
      .where('isDelete != 1')
      .getMany();
    const result = list.map(l => {
      const registerType = l.registerType;
      return {
        uid: l.id,
        userName: l.userName,
        // @ts-ignore
        gid: openRegisterTypes[registerType]
      }
    })
    return result;
  }

  async checkMicrosoftIdExist(user: User) {
    if (user) return Boolean(user.microsoftId)
    return false
  }

  async checkWechatIdExist(user: User) {
    if (user) return Boolean(user.wechatId)
    return false
  }

  async unbindMicrosoftId(userId: number) {
    const currentUser = await this.usersRepository.findOne(userId);
    if (currentUser) {
      currentUser.microsoftId = '';
      await this.usersRepository.save(currentUser);
      this.updateRedisUserInfoByUser(currentUser.id, currentUser);
      return true
    }
    return false;
  }

  async unbindWechatId(userId: number) {
    const currentUser = await this.usersRepository.findOne(userId);
    if (currentUser) {
      currentUser.wechatId = ''
      await this.usersRepository.save(currentUser)
      this.updateRedisUserInfoByUser(currentUser.id, currentUser);
      return true
    }
    return false;
  }

  async updateRedisUserInfoByUser(uid: number, currentUser: User) {
    // 更新redis用户缓存
    let userInfo = await this.getUserFromMemory(currentUser.id)
    if(userInfo){
      userInfo = { ...userInfo, ...currentUser }
      await this.setUserToMemory(currentUser.id, userInfo)
    }
  }

  async setUserToMemory(userId: number, user: IRequestUser) {
    return new Promise((resolve, reject) => {
      this.redisCache.set(TypesPrefix.user + userId, JSON.stringify(user), { ttl: ttl }, (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    })
  }

  async getUserFromMemory(userId: number) : Promise<IRequestUser>{
    return new Promise((resolve, reject) => {
      this.redisCache.get(TypesPrefix.user + userId, (err: any, result: string) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(result));
      });
    })
  }

  async resetPassword(userId: number, password: string) {
    const currentUser = await this.usersRepository.findOne(userId);
    if (currentUser) {

      currentUser.password = encodePassword(password, this.config.get('SECRET_KEY'));
      await getManager()
        .transaction(async () => {
          await this.usersRepository.save(currentUser);
          await this.resetPasswordRepository.createQueryBuilder()
            .insert()
            .orIgnore()
            .into(ResetPassword)
            .values([{
              userId,
            }])
            .execute()
        })
      return true

    }
    return false;
  }

  async checkUserActiveJobs(userName: string): Promise<boolean> {
    const RESTFULAPI = this.config.get('RESTFULAPI');
    const res = await axios.get(RESTFULAPI + '/HasCurrentActiveJob', {
      params: {
        userName,
      }
    })
    return res.data;
  }

  async openCreateUser(openId: string, userName: string) {
    if (await this.usersRepository.findOne({
      userName
    })) {
      return false;
    }
    return await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        userName,
        openId,
        registerType: 'saml',
        samlId: openId,
        createTime: new Date().getTime() + '',
      })
      .execute();
  }

  async getUserByUserName(userName: string) {
    const user = await this.usersRepository.findOne({
      userName
    })
    if (user) {
      
    }
  }
}