import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logger } from '@nestjs/common'; // Import the Logger service
// Load environment variables from .env file
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

// Function to resolve entity and migration paths
const resolvePaths = (envPath: string): any[] => {
  const resolvedPath = path.resolve(envPath);
  // Handle patterns like dist/**/*.entity{.ts,.js}
  return [resolvedPath];
};

// Create the DataSource instance
const createDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  entities: resolvePaths(process.env.DB_ENTITIES || ''),
  migrations: resolvePaths(process.env.DB_MIGRATIONS || ''),
  synchronize: isDevelopment,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Function to initialize the DataSource
export async function initializeDataSource() {
  try {
    if (!createDataSource.isInitialized) {
      Logger.log('Connecting to the database...');
      await createDataSource.initialize();
      Logger.log('Database connected successfully.');
    }
    return createDataSource;
  } catch (error) {
    Logger.error('Error connecting to the database:', error);
    throw error; // Re-throw the error after logging it
  }
}

export default createDataSource;
