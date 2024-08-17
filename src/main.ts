import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');

  const apiDocs = new DocumentBuilder()
    .setTitle('Handyman API')
    .setDescription('API documentation for the Handyman application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, apiDocs);
  SwaggerModule.setup('api/v1/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log({
    message: 'server started 🚀',
    port,
    url: `http://localhost:${port}/api/v1`,
    apidocs: `http://localhost:${port}/api/v1/docs`,
  });
}
bootstrap().catch(err => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
