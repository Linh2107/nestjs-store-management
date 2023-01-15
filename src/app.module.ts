import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { dataSourceOptions } from 'database/data-source';
import { StoreModule } from './modules/store/store.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductModule } from './modules/product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    StoreModule,
    ProductModule,
  ],
})
export class AppModule {}
