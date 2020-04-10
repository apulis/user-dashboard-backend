import { Connection, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

import { USER_REPOSITORY } from 'src/common/constants';
import { DATABASE_CONNECTION } from 'src/common/constants';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION],
  },
];
