import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterResponseDto {
  @ApiProperty({ example: 'e2b8b74b-4c5e-4a0b-847e-cf1c7bbd1b7e', description: 'User ID' })
  user_id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: '2024-08-11T12:00:00.000Z', description: 'Registration date' })
  registrationDate: Date;

  @ApiProperty({ example: '2024-08-11T12:00:00.000Z', description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ example: '2024-08-11T12:00:00.000Z', description: 'Last update date' })
  updated_at: Date;
}
