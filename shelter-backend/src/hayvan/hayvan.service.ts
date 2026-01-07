import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHayvanDto } from './dto/create-hayvan.dto';
import { UpdateHayvanDto } from './dto/update-hayvan.dto';
import { Hayvan } from './entities/hayvan.entity';

@Injectable()
export class HayvanService {
  constructor(
    @InjectRepository(Hayvan)
    private hayvanRepository: Repository<Hayvan>,
  ) {}

  create(createHayvanDto: CreateHayvanDto) {
    
    return this.hayvanRepository.save(createHayvanDto);
  }

  findAll() {
    return this.hayvanRepository.find({
      relations: ['irk', 'asilar', 'cip'], 
    });
  }

  findOne(id: number) {
    return this.hayvanRepository.findOne({
      where: { id },
      relations: ['irk', 'asilar', 'cip'],
    });
  }

  async update(id: number, updateHayvanDto: UpdateHayvanDto) {
    
    const hayvan = await this.hayvanRepository.preload({
      id: +id,
      ...updateHayvanDto,
    });

    if (!hayvan) {
      throw new NotFoundException(`Hayvan #${id} bulunamadı`);
    }

    return this.hayvanRepository.save(hayvan);
  }

  remove(id: number) {
    return this.hayvanRepository.delete(id);
  }
}