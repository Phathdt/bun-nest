import type { ProductModel } from '../../../../generated/prisma/models/Product';
import { DatabaseService } from '../../../database/database.service';
import type { CreateProductDto, UpdateProductDto } from '../../domain/dto/product.schema';
import type { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/interfaces/product.repository';

export class ProductPrismaRepo extends ProductRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.database.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map(toEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.database.product.findUnique({
      where: { id },
    });

    return product ? toEntity(product) : null;
  }

  async create(product: CreateProductDto): Promise<Product> {
    const created = await this.database.product.create({
      data: product,
    });

    return toEntity(created);
  }

  async update(id: string, product: UpdateProductDto): Promise<Product | null> {
    const exists = await this.database.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return null;
    }

    const updated = await this.database.product.update({
      where: { id },
      data: product,
    });

    return toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const exists = await this.database.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return false;
    }

    await this.database.product.delete({
      where: { id },
    });

    return true;
  }
}

function toEntity(product: ProductModel): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? undefined,
    price: product.price.toNumber(),
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
