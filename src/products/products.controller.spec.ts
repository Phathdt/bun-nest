import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { createProductSchema, updateProductSchema } from './products.schemas';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(() => {
    controller = new ProductsController(new ProductsService());
  });

  it('creates a product through the controller', () => {
    const product = controller.create({
      name: 'Monitor',
      description: '27 inch',
      price: 300,
      stock: 4,
    });

    expect(product).toMatchObject({
      name: 'Monitor',
      description: '27 inch',
      price: 300,
      stock: 4,
    });
  });

  it('validates create payloads with zod', () => {
    const pipe = new ZodValidationPipe(createProductSchema);

    expect(() =>
      pipe.transform({
        name: '',
        price: -1,
        stock: 2,
      }),
    ).toThrow(BadRequestException);
  });

  it('coerces numbers in create payloads', () => {
    const pipe = new ZodValidationPipe(createProductSchema);

    expect(
      pipe.transform({
        name: 'USB-C Cable',
        price: '12.5',
        stock: '8',
      }),
    ).toEqual({
      name: 'USB-C Cable',
      price: 12.5,
      stock: 8,
    });
  });

  it('requires at least one field for updates', () => {
    const pipe = new ZodValidationPipe(updateProductSchema);

    expect(() => pipe.transform({})).toThrow(BadRequestException);
  });
});
