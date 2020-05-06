import 'dotenv/config';
import * as dotenv from 'dotenv';
const isTestEnvironment = process.env.NODE_ENV === 'test';
const isProductionEnvironment = process.env.NODE_ENV === 'production';
console.log()
export default {
  environment: process.env.NODE_ENV || 'development',
  typeorm: {
    db: {
      host: process.env.DB_HOST || 'localhost',
      type: process.env.DB_TYPE || 'mysql',
      port: process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database:
        (isTestEnvironment ? process.env.TEST_DB_NAME : process.env.DB_NAME) ||
        'user_group',
    },
    synchronize: !isProductionEnvironment,
    logging: !isProductionEnvironment,
  }
};
