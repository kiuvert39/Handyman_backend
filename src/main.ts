import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { CommonResponseInterceptor } from './interceptors/common-response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as tsConfigPaths from 'tsconfig-paths';
tsConfigPaths.register();

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
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Remove properties that do not have decorators
      forbidNonWhitelisted: true, // Throw errors if unknown properties are found
      exceptionFactory: (validationErrors = []) => {
        const errors = validationErrors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints || {});
          return acc;
        }, {});

        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors,
        });
      },
    })
  );
  app.useGlobalInterceptors(new CommonResponseInterceptor());

  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);

  app.useGlobalFilters(new HttpExceptionFilter());

  // app.useLogger(Logger);
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
