import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('User group example')
    .setDescription('The user group API description')
    .setVersion('1.0')
    .addTag('user group')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/user-dashboard', app, document);
  await app.listen(5001);
}
bootstrap();
