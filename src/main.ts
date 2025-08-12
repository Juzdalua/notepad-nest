import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './global/filter/exception.filter';
import * as mysql from 'mysql2/promise';

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

  // const connection = await mysql.createConnection({
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  //   database: process.env.DB_DATABASE
  // });

  // const [results, fields] = await connection.query(`SELECT * FROM USER`);
  // console.log(results, fields)

  

  const a = undefined;

  await app.listen(process.env.PORT ?? 8999).then(() => {
    console.log(`✅ Application is running on: http://localhost:${process.env.PORT ?? 8999} 🚀`);
  });
}
bootstrap();
