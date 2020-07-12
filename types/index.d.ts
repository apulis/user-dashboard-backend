declare module 'dotenv/config';

declare module 'mysql2'
declare module 'moment'
declare module 'stacktrace-js'

declare module NodeJS {
  interface Global {
    firstInitingDataBase: boolean
  }
}