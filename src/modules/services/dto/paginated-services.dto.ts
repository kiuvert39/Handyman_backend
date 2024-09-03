// src/modules/services/dto/pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

export class PaginationDto<T> {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ example: 50, description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ example: 5, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ type: [CreateServiceDto], description: 'List of items' })
  items: T[];
}
