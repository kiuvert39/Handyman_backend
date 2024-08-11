import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeDataSource } from '../config/database.config'; // Adjust the path as necessary
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonResponseInterceptor } from './interceptors/common-response.interceptor';
import { EmailModule } from './modules/email/email.module';
// Import other modules as needed

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule globally available (no need to import in other modules)
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = await initializeDataSource();
        return dataSource.options;
      },
    }),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
