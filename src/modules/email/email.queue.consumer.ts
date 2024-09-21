import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MailInterface } from '../../interfaces/mail.interface';

@Processor('emailSending')
export class EmailConsumer {
  private logger = new Logger(EmailConsumer.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('welcome')
  async sendWelcomeEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;

      console.log('Job data:', job.data);
      console.log('Processing welcome email for:', mail.to);
      console.log('Email context:', mail.context);

      if (!mail.to) {
        throw new Error('No recipients defined');
      }

      await this.mailerService.sendMail({
        to: mail.to,
        subject: mail.subject,
        template: 'welcome',
        context: mail.context,
      });

      console.log('Welcome email sent to:', mail.to);
    } catch (error) {
      this.logger.error(`Error sending welcome email to ${job.data.mail.to}: ${error.message}`);
    }
  }
}
