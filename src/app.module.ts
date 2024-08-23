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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
const redisStore = require('cache-manager-redis-store');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = await initializeDataSource();
        return dataSource.options;
      },
    }),

    CacheModule.register({
      store: redisStore,
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT, 10),
      ttl: parseInt(process.env.CACHE_TTL, 10), // Default TTL
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    CraftmanModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard, // Apply RolesGuard globally
    // },
    //  {
    //     provide: APP_GUARD,
    //     useClass: AuthGuard,
    //   },
    // Other providers
  ],
})
export class AppModule {}
