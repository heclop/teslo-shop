import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('TesloShop');
  logger.log(`App running on port ${process.env.PORT}`)
  logger.log(`App running on DB_HOST ${process.env.DB_HOST}`)
  logger.log(`App running on DB_NAMEE ${process.env.DB_NAMEE}`)
  logger.log(`App running on DB_USERNAMEE ${process.env.DB_USERNAMEE}`)
  logger.log(`App running on DB_PORTT ${process.env.DB_PORTT}`)
  logger.log(`App running on DB_PASSWORDD ${process.env.DB_PASSWORDD}`)
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
