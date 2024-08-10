import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log({ message: 'server started 🚀', port, url: `http://localhost:${port}/api/v1` });
}
bootstrap().catch(err => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
