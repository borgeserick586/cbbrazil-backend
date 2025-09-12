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

  // Prefixo global com exceções para compatibilidade com frontend em desenvolvimento
  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    // Em desenvolvimento, exclui rotas de leads do prefixo para compatibilidade com frontend
    app.setGlobalPrefix('api/v1', {
      exclude: ['/leads', '/leads/with-whatsapp-trigger'],
    });
  } else {
    // Em produção, usa prefixo global para todas as rotas
    app.setGlobalPrefix('api/v1');
  }

  const port = Number(process.env.PORT) || 3000;

  // Escutar no 0.0.0.0 (importante em hospedagem)
  await app.listen(port, '0.0.0.0');

  const baseUrl =
    env === 'production'
      ? 'https://cdbrazilbackend-production-3ed4.up.railway.app/api/v1'
      : `http://localhost:${port}/api/v1`;

  console.log(`🚀 Backend rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${env}`);
  console.log(`📡 API disponível em: ${baseUrl}`);
  if (env === 'production') {
    console.log(`✅ Configurado para produção: ${baseUrl}`);
  }
}

bootstrap();
