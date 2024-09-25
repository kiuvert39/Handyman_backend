import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

export const createRedisConfig = (configService: ConfigService): RedisOptions => {
  const host = configService.get<string>('REDIS_HOST');
  const port = configService.get<number>('REDIS_PORT'); // Ensure the correct port is being passed
  const password = configService.get<string>('REDIS_PASSWORD');

  console.log('Redis Config:', { host, port, password });

  return {
    host,
    port,
    password, // Ensure the password is here
    maxRetriesPerRequest: 100,
    retryStrategy: times => Math.min(times * 50, 2000),
  };
};

export const initializeRedisClient = (configService: ConfigService) => {
  const redisConfig = createRedisConfig(configService);
  const redisClient = new Redis(redisConfig); // Uses ioredis with the config

  redisClient.on('error', err => {
    console.error('Redis connection error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Successfully connected to Redis!');
  });

  process.on('SIGINT', () => {
    redisClient.quit();
    console.log('Redis client disconnected due to app termination');
  });

  return redisClient;
};
