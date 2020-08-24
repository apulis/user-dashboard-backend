import * as redisStore from 'cache-manager-redis-store';
import * as cacheManager from 'cache-manager';
import { IRequestUser } from 'src/auth/auth.controller';

export const ttl = 3




export const RedisProvider = {
  provide: 'REDIS_MANAGER',
  useFactory: () => {
    const redisCache = cacheManager.caching({
      store: redisStore,
      host: '127.0.0.1', // default value
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
