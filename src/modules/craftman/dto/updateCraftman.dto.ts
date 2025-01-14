import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCraftsmanDto {
  @IsOptional()
  @IsString()
  skillSet?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsString()
  certifications?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
