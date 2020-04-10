import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';

import { UserService } from './user.service';
import { userProviders } from './user.providers'
import { UserController } from './user.controller';


@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...userProviders,
    UserService,
  ]
})
export class UserModule {}
