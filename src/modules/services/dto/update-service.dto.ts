import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiProperty({ example: 'Plumbing Repair', required: false })
  service_name?: string;

  @ApiProperty({ example: 'Fixing leaks, installing pipes, and other plumbing services.', required: false })
  description?: string;

  @ApiProperty({ example: 'capenter', required: true })
  category: string;

  @ApiProperty({ example: '150.00', required: false })
  price?: number;
}
