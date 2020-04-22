import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user-role.entity';
import { Repository } from 'typeorm';

const mapUserNamesAndRoleNames = (userNames: string[], roleNames: string[]) => {
  const userRole: {userName: string; roleName: string}[] = [];
  roleNames.forEach(r => {
    userNames.forEach(u => {
      userRole.push({
        userName: u,
        roleName: r,
      })
    })
  })
  return userRole;
}


@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) { }

  async checkDuplicateItems(userNames: string[], roleNames: string[]) {
    const userRole = mapUserNamesAndRoleNames(userNames, roleNames);
    const result = await this.userRoleRepository
      .find({
        where: userRole
      });
    return result;
  }

  async addRoleToUser(userNames: string[], roleNames: string[]) {
    const userRole = mapUserNamesAndRoleNames(userNames, roleNames);
    return await this.userRoleRepository
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values(userRole)
      .execute()
  }
}
