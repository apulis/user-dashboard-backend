import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initMysqlDataBase, fixMysql8Sha2Password } from 'db-init/init-database';
import { initPgDataBase } from 'db-init/init-database-pg';
import { logger } from './middleware/logger.middleware';

const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'));

const { APP_PORT } = envConfig;

import 'initial/init-request';


async function bootstrap() {
  const dbType = envConfig.DB_TYPE;
  if (dbType === 'mysql') {
    await fixMysql8Sha2Password();
    await initMysqlDataBase();
  } else if (dbType === 'postgres') {
    await initPgDataBase();
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log']
  });
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // if (process.env.NODE_ENV === 'develop') {
  const options = new DocumentBuilder()
    .setTitle('User group example')
    .setDescription('The user group API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('user group')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  // }

  app.use(helmet());
  app.use(cookieParser());
  app.disable('x-powered-by');
  await app.listen(APP_PORT || 5002);
}
bootstrap();
