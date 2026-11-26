import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './global/filter/exception.filter';
import * as fs from 'fs';
import { cloneDeep } from 'lodash';
import { getDiffObjects } from './util/utils';
import * as archiver from 'archiver';
import * as archiver_zip from 'archiver-zip-encrypted';

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

  if (process.env.NODE_ENV == 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Swagger')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .addServer('http://localhost:8999')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api-docs', app, documentFactory, {
      swaggerOptions: {
        persistAuthorization: true
      }
    });
  }
//ㅇㅇ
  const arc = archiver;
  arc.registerFormat('zip-encrypted', archiver_zip);
  let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: '123' });
  archive.append('File contents', { name: 'file.name' });

  const arr1 = [1, 2, 3, 4, 5];
  const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // O(N제곱)
  for (const arr of arr1) {
    if (arr2.includes(arr)) console.log('yum');
  }

  // O(N제곱)
  arr1.some((arr) => arr2.includes(arr));

  // O(N)
  const s = new Set(arr1);
  for (const arr of arr2) {
    if (s.has(arr)) console.log('yum');
  }

  await app.listen(process.env.PORT ?? 8999).then(() => {
    console.log(`✅ Application is running on: http://localhost:${process.env.PORT ?? 8999} 🚀`);
  });
}
bootstrap();
