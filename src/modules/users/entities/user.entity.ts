import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';
import { AbstractBaseEntity } from 'src/entities/base.entity';
import { Craftsman } from 'src/modules/craftman/entities/craftman.entity';
import { Review } from 'src/modules/craftman/entities/craftman.review.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends AbstractBaseEntity {
  @ApiProperty({ description: "The user's first name" })
  @Column({ name: 'userName', nullable: true, unique: true })
  userName: string;

  @ApiProperty({ description: "The user's first name" })
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @ApiProperty({ description: "The user's last name" })
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @ApiProperty({ description: "The user's email address" })
  @Column({ name: 'email', unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's hashed password" })
  @Column({ name: 'password', select: false })
  @Length(6, 15)
  password: string;

  @ApiProperty({ description: "The user's phone number" })
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty({ description: "The user's address" })
  @Column({ name: 'address', nullable: true })
  address: string;

  @ApiProperty({ description: "The user's role" })
  @Column({ name: 'role', nullable: true })
  role: string;

  @ApiProperty({ description: "The user's preferred language" })
  @Column({ name: 'language_preference', nullable: true })
  languagePreference: string;

  @ApiProperty({ description: 'The date when the user registered' })
  @Column({ name: 'registration_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @ApiProperty({ description: 'Indicates whether the user has verified their account' })
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @OneToMany(() => Craftsman, craftsman => craftsman.user)
  craftsmen: Craftsman[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}
