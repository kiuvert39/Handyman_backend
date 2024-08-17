import { PartialType } from '@nestjs/swagger';
import { CreateCraftmanDto } from './create-craftman.dto';

export class UpdateCraftmanDto extends PartialType(CreateCraftmanDto) {}
