import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_FILE || 'develop.env'));

const { APP_PORT } = envConfig;

import 'initial/init-request';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn']
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('User group example')
    .setDescription('The user group API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('user group')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.use(helmet());
  app.use(cookieParser());
  app.disable('x-powered-by');
  await app.listen(APP_PORT || 5001);
}
bootstrap();
