import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Pipe de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global para API
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const environment = process.env.NODE_ENV || 'development';
  const baseUrl =
    environment === 'production'
      ? `https://cbbrazil.com/api/v1`
      : `http://localhost:${port}/api/v1`;

  console.log(`🚀 Backend rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${environment}`);
  console.log(`📡 API disponível em: ${baseUrl}`);

  if (environment === 'production') {
    console.log(`✅ Configurado para produção: cbbrazil.com/api`);
  }
}
bootstrap();
