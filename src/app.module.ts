import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeDataSource } from '../config/database.config'; // Adjust the path as necessary
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from '';
// import { UserModule } from './modules/user/user.module';
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
    // AuthModule,
    // UserModule,
    // Add other modules here
  ],
  controllers: [
    // Add controllers here
  ],
  providers: [
    // Add providers here
  ],
})
export class AppModule {}
