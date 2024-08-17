import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from 'src/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Craftsman } from './craftman.entity';

@Entity('reviews')
export class Review extends AbstractBaseEntity {
  @ApiProperty({ description: 'The review ID' })
  @Column({ name: 'review_id', primary: true, generated: true })
  reviewId: number;

  @ApiProperty({ description: 'The booking ID related to this review' })
  @Column({ name: 'booking_id', nullable: true })
  bookingId: number;

  @ApiProperty({ description: 'The ID of the user who left the review' })
  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ApiProperty({ description: 'The ID of the craftsman being reviewed' })
  @ManyToOne(() => Craftsman, craftsman => craftsman.reviews)
  craftsman: Craftsman;

  @ApiProperty({ description: 'The rating given in the review' })
  @Column({ name: 'rating' })
  rating: number;

  @ApiProperty({ description: 'Optional comment or feedback' })
  @Column({ name: 'comment', nullable: true })
  comment: string;

  @ApiProperty({ description: 'The date when the review was submitted' })
  @Column({ name: 'review_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate: Date;
}
