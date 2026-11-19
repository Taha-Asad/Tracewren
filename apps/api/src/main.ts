import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from './database/prisma-exception.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cookie parser for secure session cookies
  app.use(cookieParser());

  // Global exception filter for database resilience and clean error mappings
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Global prefix for all API endpoints (with well-known excluded for RFC 9116)
  app.setGlobalPrefix('api', {
    exclude: ['.well-known/(.*)'],
  });

  // Strict runtime validation & sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Cross-Origin Resource Sharing (CORS) with frontend
  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendOrigin, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-organization-id',
      'x-program-id',
      'x-guest-signature',
      'x-cron-timestamp',
      'x-cron-signature',
    ],
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`Caulvyn API engine running on http://127.0.0.1:${port}/api`);
}

await bootstrap();
