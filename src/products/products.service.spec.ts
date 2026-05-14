import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('creates and lists products', () => {
    const product = service.create({
      name: 'Keyboard',
      price: 99,
      stock: 10,
    });

    expect(product).toMatchObject({
      name: 'Keyboard',
      price: 99,
      stock: 10,
    });
    expect(product.id).toEqual(expect.any(String));
    expect(service.findAll()).toEqual([product]);
  });

  it('updates an existing product', () => {
    const product = service.create({
      name: 'Mouse',
      price: 45,
      stock: 5,
    });

    const updated = service.update(product.id, {
      price: 39,
      stock: 3,
    });

    expect(updated).toMatchObject({
      id: product.id,
      name: 'Mouse',
      price: 39,
      stock: 3,
    });
    expect(updated.updatedAt >= product.updatedAt).toBe(true);
  });

  it('removes products', () => {
    const product = service.create({
      name: 'Desk',
      price: 250,
      stock: 2,
    });

    service.remove(product.id);

    expect(service.findAll()).toEqual([]);
    expect(() => service.findOne(product.id)).toThrow(NotFoundException);
  });
});
