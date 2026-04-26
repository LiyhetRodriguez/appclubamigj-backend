import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule as any);
  // Allow cross-origin requests (useful for local development)
  app.enableCors();
  // Serve uploaded/static files from backend/public/uploads at /uploads
  // Note: upload controller stores files under backend/public/uploads,
  // so we must serve that specific folder at the '/uploads' prefix.
  app.useStaticAssets(join(process.cwd(), 'backend', 'public', 'uploads'), { prefix: '/uploads/' });
  const port = process.env.PORT || 3000;
await app.listen(port);
console.log(`🚀 App corriendo en puerto ${port}`);
}
bootstrap();
