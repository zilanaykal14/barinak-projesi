import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarını en geniş haliyle açıyoruz (Vercel erişsin diye)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // --- RESİMLERİ AÇMA BÖLÜMÜ (GARANTİLİ YÖNTEM) ---
  // Hem dist içinden hem ana klasörden uploads'u bulmaya çalışır
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  // -------------------------------------------------

  await app.listen(process.env.PORT || 3333);
}
bootstrap();