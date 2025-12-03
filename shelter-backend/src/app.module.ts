import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IrkModule } from './irk/irk.module';
import { HayvanModule } from './hayvan/hayvan.module';
import { AsiModule } from './asi/asi.module';
import { CipModule } from './cip/cip.module';
import { BildirimModule } from './bildirim/bildirim.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      // EĞER RENDER'DAYSAK POSTGRES, YOKSA MYSQL KULLAN
      type: process.env.DATABASE_URL ? 'postgres' : 'mysql',
      
      // RENDER AYARLARI (Otomatik alır)
      url: process.env.DATABASE_URL,
      
      // LOCAL (SENİN BİLGİSAYARIN) AYARLARI
      host: process.env.DATABASE_URL ? undefined : '127.0.0.1',
      port: process.env.DATABASE_URL ? undefined : 3306,
      username: process.env.DATABASE_URL ? undefined : 'root',
      password: process.env.DATABASE_URL ? undefined : '',
      database: process.env.DATABASE_URL ? undefined : 'shelter_db',
      
      autoLoadEntities: true,
      synchronize: true, // Tabloları otomatik oluşturur
      
      // SSL Ayarı (Render için zorunlu)
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    UsersModule,
    IrkModule,
    HayvanModule,
    AsiModule,
    CipModule,
    BildirimModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}