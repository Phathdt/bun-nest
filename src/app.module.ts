import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config';
import { LoggerModule } from './modules/logger';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [ConfigModule, LoggerModule, ProductModule],
})
export class AppModule {}
