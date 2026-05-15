import type { Product } from '../entities/product.entity';
import type { CreateProductDto, UpdateProductDto } from '../dto/product.schema';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
  abstract create(product: CreateProductDto): Promise<Product>;
  abstract update(id: string, product: UpdateProductDto): Promise<Product | null>;
  abstract delete(id: string): Promise<boolean>;
}
