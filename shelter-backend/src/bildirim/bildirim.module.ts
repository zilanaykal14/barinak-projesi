import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BildirimService } from './bildirim.service';
import { BildirimController } from './bildirim.controller';
import { Bildirim } from './entities/bildirim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bildirim])],
  controllers: [BildirimController],
  providers: [BildirimService],
})
export class BildirimModule {}