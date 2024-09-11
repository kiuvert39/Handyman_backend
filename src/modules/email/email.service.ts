import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class EmailService {
  constructor(@InjectQueue('emailSending') private readonly emailQueue: Queue) {}

  async sendWelcomeEmail(name: string, email: string) {
    await this.emailQueue.add('welcome', {
      mail: {
        to: email,
        subject: 'Welcome to Handyman!',
        template: 'welcome',
        context: { name },
      },
    });
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  // update(id: number, updateEmailDto: UpdateEmailDto) {
  //   return `This action updates a #${id} email`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} email`;
  // }
}
