import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CreateCraftmanDto } from './dto/create-craftman.dto';
import { UpdateCraftmanDto } from './dto/update-craftman.dto';

@Controller('craftman')
export class CraftmanController {
  constructor(private readonly craftmanService: CraftmanService) {}

  @Post()
  create(@Body() createCraftmanDto: CreateCraftmanDto) {
    return this.craftmanService.create(createCraftmanDto);
  }

  @Get()
  findAll() {
    return this.craftmanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.craftmanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCraftmanDto: UpdateCraftmanDto) {
    return this.craftmanService.update(+id, updateCraftmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.craftmanService.remove(+id);
  }
}
