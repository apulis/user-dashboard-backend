declare module 'dotenv/config';

declare module 'mysql2'
declare module 'mysql'
declare module 'moment'
declare module 'dotenv'
declare module 'stacktrace-js'
declare module 'cache-manager'
declare module 'cache-manager-redis-store'

declare module NodeJS {
  interface Global {
    firstInitingDataBase: boolean
  }
}