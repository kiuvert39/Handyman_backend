import { ApiProperty } from '@nestjs/swagger';
import { CraftsmanDto } from './craftman.dto';

export class PaginationDto<T> {
  @ApiProperty({ description: 'The current page number' })
  page: number;

  @ApiProperty({ description: 'The number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'The total number of items available' })
  totalItems: number;

  @ApiProperty({ description: 'The total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'The list of items on the current page', type: [CraftsmanDto] })
  items: T[];
}
