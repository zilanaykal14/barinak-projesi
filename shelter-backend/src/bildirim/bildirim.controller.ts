import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BildirimService } from './bildirim.service';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';

@Controller('bildirim')
export class BildirimController {
  constructor(private readonly bildirimService: BildirimService) {}

  @Post()
  create(@Body() createBildirimDto: CreateBildirimDto) {
    return this.bildirimService.create(createBildirimDto);
  }

  @Get()
  findAll() {
    return this.bildirimService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bildirimService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBildirimDto: UpdateBildirimDto) {
    return this.bildirimService.update(+id, updateBildirimDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bildirimService.remove(+id);
  }
}
