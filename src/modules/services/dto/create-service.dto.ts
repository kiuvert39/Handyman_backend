import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}
