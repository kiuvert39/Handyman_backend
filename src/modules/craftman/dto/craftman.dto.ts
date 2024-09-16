import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user_craftman.dto';

export class CraftsmanDto {
  @ApiProperty({ description: 'Unique identifier for the craftsman' })
  id: string;

  @ApiProperty({ description: 'Timestamp of when the craftsman was created' })
  created_at: string;

  @ApiProperty({ description: 'Timestamp of the last update to the craftsman' })
  updated_at: string;

  @ApiProperty({ description: "The craftsman's skill set" })
  skillSet: string;

  @ApiProperty({ description: "The craftsman's years of experience" })
  experience: number;

  @ApiProperty({ description: 'Relevant certifications of the craftsman' })
  certifications: string;

  @ApiProperty({ description: "The craftsman's availability status" })
  isAvailable: string;

  @ApiProperty({ description: "The craftsman's average rating", nullable: true })
  rating?: number;

  @ApiProperty({ description: 'The associated user details', type: UserDto })
  user: UserDto;
}
