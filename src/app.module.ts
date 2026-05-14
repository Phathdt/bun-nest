import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [ConfigModule, ProductModule],
})
export class AppModule {}
