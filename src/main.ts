import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (
    process.env.FRONTEND_URL ?? 'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const escapeRegex = (value: string) =>
    value.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');

  const isOriginAllowed = (origin: string) =>
    allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin.includes('*')) {
        const wildcardPattern = allowedOrigin
          .split('*')
          .map((part) => escapeRegex(part))
          .join('.*');
        const pattern = new RegExp(`^${wildcardPattern}$`);

        return pattern.test(origin);
      }

      return allowedOrigin === origin;
    });

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
