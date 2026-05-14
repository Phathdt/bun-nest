import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import {
  ProductNotFoundError,
} from './application/services/product.service';
import type { Product } from './domain/entities/product.entity';
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductDto,
  type UpdateProductDto,
} from './domain/dto/product.schema';
import { ProductServicePort } from './domain/interfaces/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductServicePort) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.withHttpErrors(() => this.productService.findById(id));
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ): Promise<Product> {
    return this.withHttpErrors(() => this.productService.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.withHttpErrors(() => this.productService.delete(id));
  }

  private async withHttpErrors<T>(handler: () => Promise<T>): Promise<T> {
    try {
      return await handler();
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
