import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('TesloShop');
  logger.log(`App running on port ${process.env.PORT}`)
  logger.log(`App running on CUSTOM_DB_PASS ${process.env.CUSTOM_DB_HOST}`)
  logger.log(`App running on CUSTOM_DB_NAME ${process.env.CUSTOM_DB_NAME}`)
  logger.log(`App running on CUSTOM_DB_USER ${process.env.CUSTOM_DB_USER}`)
  logger.log(`App running on CUSTOM_DB_PORT ${process.env.CUSTOM_DB_PORT}`)
  logger.log(`App running on CUSTOM_DB_PASS ${process.env.CUSTOM_DB_PASS}`)
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

  await app.listen(process.env.PORT);
 
}
bootstrap();
