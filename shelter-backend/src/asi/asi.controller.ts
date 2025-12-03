import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsiService } from './asi.service';
import { CreateAsiDto } from './dto/create-asi.dto';
import { UpdateAsiDto } from './dto/update-asi.dto';

@Controller('asi')
export class AsiController {
  constructor(private readonly asiService: AsiService) {}

  @Post()
  create(@Body() createAsiDto: CreateAsiDto) {
    return this.asiService.create(createAsiDto);
  }

  @Get()
  findAll() {
    return this.asiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsiDto: UpdateAsiDto) {
    return this.asiService.update(+id, updateAsiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asiService.remove(+id);
  }
}
