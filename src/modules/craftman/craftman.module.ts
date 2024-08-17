import { Module } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CraftmanController } from './craftman.controller';

@Module({
  controllers: [CraftmanController],
  providers: [CraftmanService],
})
export class CraftmanModule {}
