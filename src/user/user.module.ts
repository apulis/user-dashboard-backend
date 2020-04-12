import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
  ],
})
export class UserModule {}
