import 'dotenv/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const isProductionEnvironment = process.env.NODE_ENV === 'production';


const envConfig = dotenv.parse(fs.readFileSync(process.env.NODE_ENV + '.env'));

export default {
  environment: process.env.NODE_ENV || 'development',
  typeorm: {
    db: {
      host: envConfig.DB_HOST || 'localhost',
      type: envConfig.DB_TYPE || 'mysql',
      port: envConfig.DB_PORT || 3306,
      username: envConfig.DB_USERNAME || 'root',
      password: envConfig.DB_PASSWORD || '123456',
      database: envConfig.DB_NAME || 'user_group'
    },
    synchronize: !isProductionEnvironment,
    logging: !isProductionEnvironment,
  }
};
