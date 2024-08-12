import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The userName of the user' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 15)
  password: string;
}
