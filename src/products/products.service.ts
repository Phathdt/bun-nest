import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductDto, Product, UpdateProductDto } from './products.schemas';

@Injectable()
export class ProductsService {
  private readonly products = new Map<string, Product>();

  findAll(): Product[] {
    return [...this.products.values()];
  }

  findOne(id: string): Product {
    const product = this.products.get(id);

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  create(dto: CreateProductDto): Product {
    const now = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: now,
      updatedAt: now,
    };

    this.products.set(product.id, product);
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const current = this.findOne(id);
    const product: Product = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.products.set(id, product);
    return product;
  }

  remove(id: string): void {
    this.findOne(id);
    this.products.delete(id);
  }
}
