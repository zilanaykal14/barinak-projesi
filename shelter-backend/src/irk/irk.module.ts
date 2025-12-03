import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrkService } from './irk.service';
import { IrkController } from './irk.controller';
import { Irk } from './entities/irk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Irk])], // Veritabanına tanıttık
  controllers: [IrkController],
  providers: [IrkService],
})
export class IrkModule {}
