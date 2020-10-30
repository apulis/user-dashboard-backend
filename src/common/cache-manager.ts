import * as redisStore from 'cache-manager-redis-store';
import * as cacheManager from 'cache-manager';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { IRequestUser } from 'src/auth/auth.controller';

export const ttl = 3

const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'));

const { APP_HOST } = envConfig;


export const RedisProvider = {
  provide: 'REDIS_MANAGER',
  useFactory: () => {
    const redisCache = cacheManager.caching({
      store: redisStore,
      host: APP_HOST, // default value
      port: 9301, // default value
      db: 0,
      ttl,
    });
    return redisCache
  },
}


export const setUserToMemory = (userId: number, user: IRequestUser) => {
  // return new Promise((resolve, reject) => {
  //   redisCache.set(TypesPrefix.user + userId, JSON.stringify(user), { ttl }, (err: any) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     resolve();
  //   });
  // })
}

// export const getUserFromMemory = (userId: number) => {
//   return new Promise((resolve, reject) => {
//     redisCache.get('foo', (err: any, result: string) => {
//       if (err) {
//         reject(err)
//         return;
//       }
//       resolve(JSON.parse(result))
//     })
//   })
// }
