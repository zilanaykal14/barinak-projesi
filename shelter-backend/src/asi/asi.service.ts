import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsiDto } from './dto/create-asi.dto';
import { UpdateAsiDto } from './dto/update-asi.dto';
import { Asi } from './entities/asi.entity';

@Injectable()
export class AsiService {
  constructor(
    @InjectRepository(Asi)
    private asiRepository: Repository<Asi>,
  ) {}

  create(createAsiDto: CreateAsiDto) {
    return this.asiRepository.save(createAsiDto);
  }

  // BURASI HATALIYDI, ŞİMDİ DÜZELDİ:
  findAll() {
    return this.asiRepository.find(); // Artık gerçek aşı listesini döndürecek
  }

  findOne(id: number) {
    return this.asiRepository.findOneBy({ id });
  }

  update(id: number, updateAsiDto: UpdateAsiDto) {
    return this.asiRepository.update(id, updateAsiDto);
  }

  remove(id: number) {
    return this.asiRepository.delete(id);
  }
}