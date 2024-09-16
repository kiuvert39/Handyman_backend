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
  @Column({ name: 'role', nullable: true, default: 'customer' })
  role: string;

  @ApiProperty({ description: "The user's preferred language" })
  @Column({ name: 'language_preference', nullable: true })
  languagePreference: string;

  @ApiProperty({ description: 'Indicates whether the user has verified their account' })
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  // New field to track if the user has completed the initial setup (choosing between Craftsman or Normal User)
  @ApiProperty({ description: 'Indicates whether the user has completed their initial setup' })
  @Column({ name: 'has_completed_initial_setup', default: false })
  hasCompletedInitialSetup: boolean;

  @OneToMany(() => Craftsman, craftsman => craftsman.user)
  craftsmen: Craftsman[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}
