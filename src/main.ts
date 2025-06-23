import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalHttpExceptionFilter } from './global/filter/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://192.168.1.23:5173', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: ['Set-Cookie']
  });

  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(process.env.PORT ?? 8999).then(() => {
    console.log(`✅ Application is running on: http://localhost:${process.env.PORT ?? 8999} 🚀`);
  });
}
bootstrap();
