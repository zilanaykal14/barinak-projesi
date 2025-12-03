import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HayvanService } from './hayvan.service';
import { CreateHayvanDto } from './dto/create-hayvan.dto';
import { UpdateHayvanDto } from './dto/update-hayvan.dto';

@Controller('hayvan')
export class HayvanController {
  constructor(private readonly hayvanService: HayvanService) {}

  @Post()
  create(@Body() createHayvanDto: CreateHayvanDto) {
    return this.hayvanService.create(createHayvanDto);
  }

  @Get()
  findAll() {
    return this.hayvanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hayvanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHayvanDto: UpdateHayvanDto) {
    return this.hayvanService.update(+id, updateHayvanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hayvanService.remove(+id);
  }
}
