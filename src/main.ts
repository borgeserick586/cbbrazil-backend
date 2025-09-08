import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

function normalizeOrigin(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.origin; // remove /gdf se vier no env
  } catch {
    return value;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - permitir tanto a origem base quanto subpaths
  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:8080';

  app.enableCors({
    origin: [frontendOrigin, `${frontendOrigin}/gdf`],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global
  app.setGlobalPrefix('api/v1');

  const port = Number(process.env.PORT) || 3000;
  const env = process.env.NODE_ENV || 'development';

  // Escutar no 0.0.0.0 (importante em hospedagem)
  await app.listen(port, '0.0.0.0');

  const baseUrl =
    env === 'production'
      ? 'https://cbbrazil.com/api/v1'
      : `http://localhost:${port}/api/v1`;

  console.log(`🚀 Backend rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${env}`);
  console.log(`📡 API disponível em: ${baseUrl}`);
  if (env === 'production') {
    console.log(`✅ Configurado para produção: cbbrazil.com/api/v1`);
  }
}

bootstrap();
