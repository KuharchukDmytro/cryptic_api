import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL, // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    allowedHeaders: 'Content-Type, Accept', // Allow these headers
    credentials: true, // Enable credentials
  });

  app.useGlobalPipes(new ValidationPipe());

  const unused = '';
  app.setGlobalPrefix('/api/v1');
  await app.listen(8080);
}

bootstrap();
