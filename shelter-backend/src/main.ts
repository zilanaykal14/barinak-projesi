import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

 
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));


  await app.listen(process.env.PORT || 3333);
}
bootstrap();