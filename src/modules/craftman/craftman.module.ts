import { Module } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CraftmanController } from './craftman.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftman.entity';
import { User } from '../users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
const redisStore = require('cache-manager-redis-store');
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Craftsman, User]),

    CacheModule.register({
      store: redisStore, // Ensure redisStore is properly imported and configured
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT, 10),
      ttl: parseInt(process.env.CACHE_TTL, 10), // Default TTL
    }),
  ],

  controllers: [CraftmanController],
  providers: [CraftmanService, AuthGuard],
})
export class CraftmanModule {}
