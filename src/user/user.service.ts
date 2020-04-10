import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { USER_REPOSITORY } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repo: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.repo.find();
  }
}
