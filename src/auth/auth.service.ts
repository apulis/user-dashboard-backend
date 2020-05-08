import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, decode } from 'jsonwebtoken';
import axios from 'axios';

import { User } from 'src/user/user.entity';
import { encodePassword } from 'src/utils';
import { ConfigService } from 'config/config.service';
import { getJwtExp } from 'src/utils';
import { GroupUser } from 'src/group-user/group-user.entity';
import { GroupRole } from 'src/group-role/group-role.entity';
import { UserRole } from 'src/user-role/user-role.entity';
import { Role } from 'src/role/role.entity';
import { MS_OAUTH2_URL } from 'src/constants/config';
import { RegisterTypes } from 'src/constants/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(GroupUser) private readonly groupUsersRepository: Repository<GroupUser>,
    @InjectRepository(GroupRole) private readonly groupRoleRespository: Repository<GroupRole>,
    @InjectRepository(UserRole) private readonly userRoleRespository: Repository<UserRole>,
    @InjectRepository(Role) private readonly roleRespository: Repository<Role>,
    private readonly config: ConfigService,
  ) {
  }
  
  async validateUserAccount(userName: string, password: string): Promise<false | User> {
    const user = await this.usersRepository.findOne({
      userName,
    })
    const SECRET_KEY = this.config.get('SECRET_KEY');
    if (user && user.password === encodePassword(password, SECRET_KEY)) {
      return user;
    }
    return false;
  }

  getIdToken(uid: number, userName?: string) {
    const JWT_SECRET_KEY = this.config.get('JWT_SECRET_KEY');
    return sign({
      uid,
      userName,
      exp: getJwtExp(),
    }, JWT_SECRET_KEY)
  }

  async getUserRoles(userId: number) {
    const groups = await this.groupUsersRepository.find({
      userId,
    });
    let groupRolesId: number[];
    if (groups.length !== 0) {
      const groupIds = groups.map(val => val.id);
      const groupRoles = await this.groupRoleRespository
        .createQueryBuilder('group_role')
        .select(['group_role.roleId', 'group_role.id', 'group_role.groupId'])
        .where('groupId IN (:groupIds)', { groupIds })
        .getMany();
      groupRolesId = groupRoles.map(val => val.roleId);
    } else {
      groupRolesId = []
    }
    const userRoles = await this.userRoleRespository
      .find({
        userId
      });
    const userRoleId = userRoles.map(val => val.roleId);
    const currentRoleIds = [...new Set(groupRolesId.concat(userRoleId))];
    let currentAuthority: Role[];
    if (currentRoleIds.length !== 0) {
      currentAuthority = await this.roleRespository
        .createQueryBuilder('role')
        .select(['name'].map(val => 'role.' + val))
        .where('role.id IN (:roleIds)', { roleIds: currentRoleIds })
        .getMany();
    } else {
      currentAuthority = []
    }
    
    return currentAuthority.map(val => val.name);
  }

  async validateUser(uid: number): Promise<undefined | User> {
    const user = await this.usersRepository.findOne({
      id: uid,
      isDelete: 0,
    });
    return user;
  }

  async getMicrosoftAccountInfo(code: string, redirectUri: string) {
    const res = await axios.post(MS_OAUTH2_URL + '/token', new URLSearchParams({
      client_id: this.config.get('MS_CLIENT_ID'),
      scope: 'openid profile email',
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      client_secret: this.config.get('MD_CLIENT_SECRET')
    }));
    const data = res.data;
    const id_token = data.id_token;
    const userInfo = decode(id_token);
    return {
      openId: (userInfo as any).email,
      nickName: (userInfo as any).name,
      registerType: RegisterTypes.Microsoft,
    }
  }
}
