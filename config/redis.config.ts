import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

export const createRedisConfig = (configService: ConfigService): RedisOptions => {
  const host = configService.get<string>('REDIS_HOST');
  const port = configService.get<number>('REDIS_PORT');
  const password = configService.get<string>('REDIS_PASSWORD');

  console.log('Redis Config:', { host, port, password });

  return {
    host: host || 'default-host', // Default host
    port: port || 6379, // Default port
    password: password || '', // Default password
    tls: {
      rejectUnauthorized: true,
    },
    maxRetriesPerRequest: 5, // Adjust this value as needed
    retryStrategy: times => {
      // Implement your retry strategy if needed
      return Math.min(times * 50, 2000); // 50ms delay for each retry, max 2000ms
    },
  };
};

export const initializeRedisClient = (configService: ConfigService) => {
  const redisConfig = createRedisConfig(configService);
  const redisClient = new Redis(redisConfig);

  // Handle connection errors
  redisClient.on('error', err => {
    console.error('Redis connection error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Successfully connected to Redis!');
  });

  return redisClient;
};
