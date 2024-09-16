import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCraftmanDto {
  @ApiProperty({ description: "The craftsman's skill set" })
  @IsString()
  skillSet: string;

  @ApiProperty({ description: "The craftsman's years of experience", required: false })
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiProperty({ description: 'Relevant certifications', required: false })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty({ description: "The craftsman's availability status" })
  @IsString()
  isAvailable: string;
}
