import { Module } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CraftmanController } from './craftman.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftman.entity';
import { User } from '../users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
    TypeOrmModule.forFeature([Craftsman, User]),

    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '0', 10),
        password: process.env.REDIS_PASSWORD,
      }),
    }),
  ],

  controllers: [CraftmanController],
  providers: [CraftmanService],
})
export class CraftmanModule {}
