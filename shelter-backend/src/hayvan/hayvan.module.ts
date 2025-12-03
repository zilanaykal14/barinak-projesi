import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HayvanService } from './hayvan.service';
import { HayvanController } from './hayvan.controller';
import { Hayvan } from './entities/hayvan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hayvan])],
  controllers: [HayvanController],
  providers: [HayvanService],
})
export class HayvanModule {}