import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

import { AuthGuard } from '../../guards/auth.guard';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './email.queue.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
  ],
  controllers: [],
  providers: [EmailService, AuthGuard, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
