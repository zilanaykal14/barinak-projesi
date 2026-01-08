import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';
import { Cip } from './entities/cip.entity'; 

@Injectable()
export class CipService {
 
  constructor(
    @InjectRepository(Cip)
    private cipRepository: Repository<Cip>,
  ) {}


  create(createCipDto: CreateCipDto) {
    return this.cipRepository.save(createCipDto);
  }

  findAll() {
    return this.cipRepository.find(); 
  }

  findOne(id: number) {
  
    return this.cipRepository.findOneBy({ id });
  }

  update(id: number, updateCipDto: UpdateCipDto) {
 
    return this.cipRepository.update(id, updateCipDto);
  }

  remove(id: number) {

    return this.cipRepository.delete(id);
  }
}