declare module 'dotenv/config';

declare module 'mysql2'

declare module NodeJS {
  interface Global {
    firstInitingDataBase: boolean
  }
}