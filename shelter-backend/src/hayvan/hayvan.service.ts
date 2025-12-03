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
    // .save() metodu ilişkileri (çip, aşı) otomatik yönetir
    return this.hayvanRepository.save(createHayvanDto);
  }

  findAll() {
    return this.hayvanRepository.find({
      relations: ['irk', 'asilar', 'cip'], // Tüm detayları getir
    });
  }

  findOne(id: number) {
    return this.hayvanRepository.findOne({
      where: { id },
      relations: ['irk', 'asilar', 'cip'],
    });
  }

  async update(id: number, updateHayvanDto: UpdateHayvanDto) {
    // Güncelleme için önce veriyi hazırla (preload), sonra kaydet (save)
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