import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logger } from '@nestjs/common';

// Load environment variables from .env file
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

// Log environment details
Logger.log(`Environment: ${process.env.NODE_ENV}`);
Logger.log(`Database Host: ${process.env.DB_HOST}`);
Logger.log(`Database Name: ${process.env.DB_DATABASE}`);
Logger.log(`SSL Enabled: ${process.env.DB_SSL === 'true' ? 'Yes' : 'No'}`);

// Function to resolve entity and migration paths
const resolvePaths = (envPath: string): string[] => {
  if (!envPath) {
    Logger.error('Entity or migration path not specified.');
    return [];
  }

  const resolvedPath = path.resolve(envPath);
  Logger.log(`Resolved Path: ${resolvedPath}`);
  return [resolvedPath];
};

// Ensure required environment variables are set
const checkEnvVariables = () => {
  const requiredEnvVars = [
    'DB_TYPE',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_DATABASE',
    'DB_ENTITIES',
    'DB_MIGRATIONS',
  ];

  requiredEnvVars.forEach(variable => {
    if (!process.env[variable]) {
      Logger.error(`Missing required environment variable: ${variable}`);
    }
  });
};

checkEnvVariables();

// Create the DataSource instance
const createDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE,
  entities: resolvePaths(process.env.DB_ENTITIES),
  migrations: resolvePaths(process.env.DB_MIGRATIONS),
  synchronize: isDevelopment, // Use this only in development
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
    Logger.error('Error connecting to the database:', error.message);
    if (error.stack) {
      Logger.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

export default createDataSource;
