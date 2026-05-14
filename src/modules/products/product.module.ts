import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './domain/interfaces/product.repository';
import { ProductServicePort } from './domain/interfaces/product.service';
import { ProductPrismaRepo } from './infrastructure/repositories/product.prisma-repository';
import { ProductController } from './product.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    {
      provide: ProductRepository,
      useFactory: (database: DatabaseService) => new ProductPrismaRepo(database),
      inject: [DatabaseService],
    },
    {
      provide: ProductServicePort,
      useFactory: (repository: ProductRepository) => new ProductService(repository),
      inject: [ProductRepository],
    },
  ],
  exports: [ProductServicePort, ProductRepository],
})
export class ProductModule {}
