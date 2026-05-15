import type { Product } from '../entities/product.entity';
import type { CreateProductDto, UpdateProductDto } from '../dto/product.schema';

export abstract class ProductServicePort {
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product>;
  abstract create(product: CreateProductDto): Promise<Product>;
  abstract update(id: string, product: UpdateProductDto): Promise<Product>;
  abstract delete(id: string): Promise<void>;
}
