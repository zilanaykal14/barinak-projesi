import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CipService } from './cip.service';
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';

@Controller('cip')
export class CipController {
  constructor(private readonly cipService: CipService) {}

  @Post()
  create(@Body() createCipDto: CreateCipDto) {
    return this.cipService.create(createCipDto);
  }

  @Get()
  findAll() {
    return this.cipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCipDto: UpdateCipDto) {
    return this.cipService.update(+id, updateCipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cipService.remove(+id);
  }
}
