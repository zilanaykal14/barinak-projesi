import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IrkService } from './irk.service';
import { CreateIrkDto } from './dto/create-irk.dto';
import { UpdateIrkDto } from './dto/update-irk.dto';

@Controller('irk')
export class IrkController {
  constructor(private readonly irkService: IrkService) {}

  @Post()
  create(@Body() createIrkDto: CreateIrkDto) {
    return this.irkService.create(createIrkDto);
  }

  @Get()
  findAll() {
    return this.irkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.irkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIrkDto: UpdateIrkDto) {
    return this.irkService.update(+id, updateIrkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.irkService.remove(+id);
  }
}
