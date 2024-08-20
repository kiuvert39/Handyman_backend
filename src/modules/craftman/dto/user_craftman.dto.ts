import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  userId: string;

  @ApiProperty({ description: 'Timestamp of when the user was created' })
  created_at: string;

  @ApiProperty({ description: 'Timestamp of the last update to the user' })
  updated_at: string;

  @ApiProperty({ description: 'Username of the user' })
  userName: string;

  @ApiProperty({ description: 'First name of the user', nullable: true })
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user', nullable: true })
  lastName?: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ description: 'Phone number of the user', nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Address of the user', nullable: true })
  address?: string;

  @ApiProperty({ description: 'Role of the user', nullable: true })
  role?: string;

  @ApiProperty({ description: 'Language preference of the user', nullable: true })
  languagePreference?: string;

  @ApiProperty({ description: 'Registration date of the user' })
  registrationDate: string;

  @ApiProperty({ description: 'Whether the user is verified or not' })
  isVerified: boolean;
}
