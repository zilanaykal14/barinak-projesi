import { Injectable } from '@nestjs/common';
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';

@Injectable()
export class CipService {
  create(createCipDto: CreateCipDto) {
    return 'This action adds a new cip';
  }

  findAll() {
    return `This action returns all cip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cip`;
  }

  update(id: number, updateCipDto: UpdateCipDto) {
    return `This action updates a #${id} cip`;
  }

  remove(id: number) {
    return `This action removes a #${id} cip`;
  }
}