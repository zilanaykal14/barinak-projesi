import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { UpdateBildirimDto } from './dto/update-bildirim.dto'; 
import { Bildirim } from './entities/bildirim.entity';

@Injectable()
export class BildirimService {
  constructor(
    @InjectRepository(Bildirim)
    private bildirimRepo: Repository<Bildirim>,
  ) {}

  create(createBildirimDto: CreateBildirimDto) {
    return this.bildirimRepo.save(createBildirimDto);
  }

  findAll() {
    return this.bildirimRepo.find({ order: { id: 'DESC' } });
  }

  findOne(id: number) {
    return this.bildirimRepo.findOneBy({ id });
  }

  
  update(id: number, updateBildirimDto: UpdateBildirimDto) {
    return this.bildirimRepo.update(id, updateBildirimDto);
  }

  remove(id: number) {
    return this.bildirimRepo.delete(id);
  }
}