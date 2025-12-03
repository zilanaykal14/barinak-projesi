import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Bu eksikti
import { CipService } from './cip.service';
import { CipController } from './cip.controller';
import { Cip } from './entities/cip.entity'; // <-- Bu eksikti

@Module({
  imports: [TypeOrmModule.forFeature([Cip])], // <-- İŞTE ÇÖZÜM BURASI
  controllers: [CipController],
  providers: [CipService],
})
export class CipModule {}