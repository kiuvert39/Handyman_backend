import { ApiProperty } from '@nestjs/swagger';
import { AbstractBaseEntity } from 'src/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('services')
export class Service extends AbstractBaseEntity {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Plumbing Repair',
  })
  @Column({ type: 'varchar', length: 255 })
  service_name: string;

  @ApiProperty({
    description: 'Detailed description of the service',
    example: 'Fixing leaks, installing pipes, and other plumbing services.',
  })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty({
    description: 'Category of the service',
    example: 'Plumbing',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  category: string;

  @ApiProperty({
    description: 'Price of the service',
    example: 150.0,
    type: 'number',
    format: 'decimal',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
