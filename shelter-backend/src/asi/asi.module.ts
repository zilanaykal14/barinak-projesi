import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsiService } from './asi.service';
import { AsiController } from './asi.controller';
import { Asi } from './entities/asi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asi])],
  controllers: [AsiController],
  providers: [AsiService],
})
export class AsiModule {}

