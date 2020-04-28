import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { User } from 'src/user/user.entity';
import { encodePassword } from 'src/utils';
import { ConfigService } from 'config/config.service';
import { getJwtExp } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {
  }
  
  async validateUser(userName: string, password: string): Promise<false | User> {
    const user = await this.usersRepository.findOne({
      userName,
    })
    const SECRET_KEY = this.config.get('SECRET_KEY');
    if (user && user.password === encodePassword(password, SECRET_KEY)) {
      return user;
    }
    return false;
  }

  async getIdToken(uid: number, userName: string, ) {
    const JWT_SIGN = this.config.get('JWT_SIGN');
    return sign({
      uid,
      userName,
      exp: getJwtExp(),
    }, JWT_SIGN)
  }

}
