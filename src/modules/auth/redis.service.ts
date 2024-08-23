import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  // Set a refresh token with a 7-day expiration time
  async setRefreshToken(userId: string, token: string): Promise<void> {
    try {
      await this.redisClient.set(`refreshToken:${userId}`, token, 'EX', 60 * 60 * 24 * 7); // 7 days expiration
      this.logger.log(`Refresh token set for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to set refresh token for user ${userId}`, error.stack);
    }
  }

  // Retrieve the refresh token for a given userId
  async getRefreshToken(userId: string): Promise<string | null> {
    try {
      const token = await this.redisClient.get(`refreshToken:${userId}`);
      if (token) {
        this.logger.log(`Refresh token retrieved for user ${userId}`);
      } else {
        this.logger.warn(`No refresh token found for user ${userId}`);
      }
      return token;
    } catch (error) {
      this.logger.error(`Failed to get refresh token for user ${userId}`, error.stack);
      return null;
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      await this.redisClient.del(`refreshToken:${userId}`);
      this.logger.log(`Refresh token deleted for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to delete refresh token for user ${userId}`, error.stack);
    }
  }
}
