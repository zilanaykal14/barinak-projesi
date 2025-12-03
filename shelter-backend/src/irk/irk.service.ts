import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIrkDto } from './dto/create-irk.dto';
import { UpdateIrkDto } from './dto/update-irk.dto';
import { Irk } from './entities/irk.entity';

@Injectable()
export class IrkService {
  constructor(
    @InjectRepository(Irk)
    private irkRepository: Repository<Irk>,
  ) {}

  create(createIrkDto: CreateIrkDto) {
    return this.irkRepository.save(createIrkDto);
  }

  findAll() {
    return this.irkRepository.find({ relations: ['hayvanlar'] });
  }

  findOne(id: number) {
    return this.irkRepository.findOne({ where: { id }, relations: ['hayvanlar'] });
  }

  update(id: number, updateIrkDto: UpdateIrkDto) {
    return this.irkRepository.update(id, updateIrkDto);
  }

  remove(id: number) {
    return this.irkRepository.delete(id);
  }
}