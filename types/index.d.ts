declare module 'dotenv/config';

declare module 'mysql'

declare module NodeJS {
  interface Global {
    firstInitingDataBase: boolean
  }
}