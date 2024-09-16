export class Craftman {}
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from 'src/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Review } from './craftman.review.entity';

@Entity('craftsmen')
export class Craftsman extends AbstractBaseEntity {
  @ApiProperty({ description: 'The ID of the associated user' })
  @ManyToOne(() => User, user => user.craftsmen, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: "The craftsman's skill set" })
  @Column({ name: 'skill_set' })
  skillSet: string;

  @ApiProperty({ description: "The craftsman's years of experience" })
  @Column({ name: 'experience', nullable: true })
  experience: number;

  @ApiProperty({ description: 'Relevant certifications' })
  @Column({ name: 'certifications', nullable: true })
  certifications: string;

  @ApiProperty({ description: "The craftsman's availability status" })
  @Column({ name: 'is_available' })
  isAvailable: string; // Corrected here

  @ApiProperty({ description: "The craftsman's average rating" })
  @Column({ name: 'rating', type: 'decimal', nullable: true })
  rating: number;

  @OneToMany(() => Review, review => review.craftsman)
  reviews: Review[];
}
