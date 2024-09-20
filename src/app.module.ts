import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeDataSource } from '../config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { CraftmanModule } from './modules/craftman/craftman.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServicesModule } from './modules/services/services.module';
import { createRedisConfig } from '../config/redis.config';
import * as redisStore from 'cache-manager-ioredis';
import { initializeRedisClient } from '../config/redis.config'; // Import the function

// Log the Redis connection settings before the module is defined
console.log('Redis Host:', process.env.CACHE_HOST);
console.log('Redis Port:', process.env.CACHE_PORT);
console.log('Redis Password:', process.env.CACHE_PASSWORD);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Email module setup
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Team Handyman" <${configService.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: process.cwd() + '/src/modules/email/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Bull queue for background jobs
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: createRedisConfig(configService),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),

    // TypeORM setup
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = await initializeDataSource();
        return dataSource.options;
      },
    }),

    // Redis Cache setup using cache-manager-ioredis
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        ...createRedisConfig(configService),
      }),
      inject: [ConfigService],
    }),

    // Other modules
    AuthModule,
    UsersModule,
    EmailModule,
    CraftmanModule,
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    // Other providers (e.g., Guards)
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    // Initialize Redis client and handle connection errors
    const redisClient = initializeRedisClient(configService);
    redisClient.on('error', err => {
      console.error('Redis connection error:', err);
    });
    redisClient.on('connect', () => {
      console.log('Successfully connected to Redis!');
    });
  }
}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { initializeDataSource } from '../config/database.config';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { EmailModule } from './modules/email/email.module';
// import { CraftmanModule } from './modules/craftman/craftman.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { BullModule } from '@nestjs/bull';
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { ServicesModule } from './modules/services/services.module';
// import * as redisStore from 'cache-manager-ioredis';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     MailerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         transport: {
//           host: configService.get<string>('SMTP_HOST'),
//           port: configService.get<number>('SMTP_PORT'),
//           secure: false,
//           auth: {
//             user: configService.get<string>('SMTP_USER'),
//             pass: configService.get<string>('SMTP_PASSWORD'),
//           },
//         },
//         defaults: {
//           from: `"Team Handyman" <${configService.get<string>('SMTP_USER')}>`,
//         },
//         template: {
//           dir: process.cwd() + '/src/modules/email/templates',
//           adapter: new HandlebarsAdapter(),
//           options: {
//             strict: true,
//           },
//         },
//       }),
//       inject: [ConfigService],
//     }),
//     BullModule.forRoot({
//       redis: {
//         host: process.env.REDIS_HOST,
//         port: parseInt(process.env.REDIS_PORT, 10),
//         password: process.env.REDIS_PASSWORD,
//         tls: {
//           rejectUnauthorized: true
//         }
//       },
//     }),
//     BullModule.registerQueue({
//       name: 'emailSending',
//     }),
//     TypeOrmModule.forRootAsync({
//       useFactory: async () => {
//         const dataSource = await initializeDataSource();
//         return dataSource.options;
//       },
//     }),

//     CacheModule.register({
//       store: redisStore,
//       host: process.env.CACHE_HOST,
//       port: parseInt(process.env.CACHE_PORT, 10),
//       password: process.env.CACHE_PASSWORD,
//       ttl: parseInt(process.env.CACHE_TTL, 10), // Default TTL
//        tls: {
//           rejectUnauthorized: true
//         },
//         retryStrategy(times) {
//           const delay = Math.min(times * 50, 2000);
//           return delay;
//         },
//     }),
//     AuthModule,
//     UsersModule,
//     EmailModule,
//     CraftmanModule,
//     ServicesModule,
//   ],
//   controllers: [],
//   providers: [
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: CacheInterceptor,
//     },
//     // {
//     //   provide: APP_GUARD,
//     //   useClass: RolesGuard, // Apply RolesGuard globally
//     // },
//     //  {
//     //     provide: APP_GUARD,
//     //     useClass: AuthGuard,
//     //   },
//     // Other providers
//   ],
// })
// export class AppModule {}
