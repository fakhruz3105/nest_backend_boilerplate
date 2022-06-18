import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/app.module';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  app.use(morgan('combined'));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port: number = config.get<number>('PORT');
  await app.listen(port, () => {
    console.log('[LISTENING AT]', config.get<string>('BACKEND_BASE_URL'));
  });
}
bootstrap();
