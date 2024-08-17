import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  controllers: [EmailController],
  providers: [EmailService, AuthGuard],
})
export class EmailModule {}
