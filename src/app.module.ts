import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null,
      },
      type: 'postgres',
      // host: process.env.CUSTOM_DB_HOST,
      // port: +process.env.CUSTOM_DB_PORT,
      // database: process.env.CUSTOM_DB_NAME,
      // username: process.env.CUSTOM_DB_USER,
      // password: process.env.CUSTOM_DB_PASS,
      url: 'postgresql://postgres:dkVpRACIXFdiMgXQOAAqPuSwyIwxWlqu@autorack.proxy.rlwy.net:40638/railway',
      autoLoadEntities: true,
      synchronize: true,

    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
