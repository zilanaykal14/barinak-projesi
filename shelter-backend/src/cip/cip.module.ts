import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CipService } from './cip.service';
import { CipController } from './cip.controller';
import { Cip } from './entities/cip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cip])], 
  controllers: [CipController],
  providers: [CipService],
})
export class CipModule {}