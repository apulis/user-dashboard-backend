import { createConnection, ConnectionOptions } from 'typeorm';

import databaseConfig from 'config/database.json';
import { DATABASE_CONNECTION } from 'src/common/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async () => await createConnection(
      {
        ...databaseConfig,
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      } as ConnectionOptions
    ),
  },
];