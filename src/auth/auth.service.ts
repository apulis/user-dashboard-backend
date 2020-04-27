import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { encodePassword } from 'src/utils';
import { ConfigService } from 'config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {
    this.config = config;
  }
  
  async validateUser(userName: string, password: string) {
    const user = await this.usersRepository.findOne({
      userName,
    })
    const SECRET_KEY = this.config.get('SECRET_KEY');
    if (user && user.password === encodePassword(password, SECRET_KEY)) {
      return true;
    }
    return false;
  }
}
