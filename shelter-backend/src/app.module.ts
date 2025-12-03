import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // YENİ
import { join } from 'path'; // YENİ
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IrkModule } from './irk/irk.module';
import { HayvanModule } from './hayvan/hayvan.module';
import { AsiModule } from './asi/asi.module';
import { BildirimModule } from './bildirim/bildirim.module';
import { CipModule } from './cip/cip.module';

@Module({
  imports: [
    // Resim klasörünü internete aç (Public yap)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'shelter_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    IrkModule,
    HayvanModule,
    AsiModule,
    BildirimModule,
    CipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}