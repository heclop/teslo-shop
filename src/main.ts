import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const logger = new Logger('TesloShop');
  logger.log(`App running on port ${process.env.PORT}`)
  logger.log(`App running on DATABASE_URL ${process.env.DATABASE_URL}`)

  // Asegurar que dotenv carga el .env en Railway
  dotenv.config({ path: '.env' });

  const app = await NestFactory.create(AppModule);
  

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTful API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  console.log('Variables cargadas en Railway:', process.env);


  await app.listen(process.env.PORT);
 
}
bootstrap();
