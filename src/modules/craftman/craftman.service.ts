import { Injectable } from '@nestjs/common';
import { CreateCraftmanDto } from './dto/create-craftman.dto';
import { UpdateCraftmanDto } from './dto/update-craftman.dto';

@Injectable()
export class CraftmanService {
  create(createCraftmanDto: CreateCraftmanDto) {
    return 'This action adds a new craftman';
  }

  findAll() {
    return `This action returns all craftman`;
  }

  findOne(id: number) {
    return `This action returns a #${id} craftman`;
  }

  update(id: number, updateCraftmanDto: UpdateCraftmanDto) {
    return `This action updates a #${id} craftman`;
  }

  remove(id: number) {
    return `This action removes a #${id} craftman`;
  }
}
