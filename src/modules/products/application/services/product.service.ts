import type { CreateProductDto, UpdateProductDto } from '../../domain/dto/product.schema';
import type { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/interfaces/product.repository';
import { ProductServicePort } from '../../domain/interfaces/product.service';

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductService extends ProductServicePort {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    return product;
  }

  create(product: CreateProductDto): Promise<Product> {
    return this.productRepository.create(product);
  }

  async update(id: string, product: UpdateProductDto): Promise<Product> {
    const updated = await this.productRepository.update(id, product);

    if (!updated) {
      throw new ProductNotFoundError(id);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new ProductNotFoundError(id);
    }
  }
}
