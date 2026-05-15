import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductRepository } from '../../domain/interfaces/product.repository';
import { ProductNotFoundError, ProductService } from './product.service';

describe('ProductService', () => {
  let repository: ProductRepository;
  let service: ProductService;
  const now = new Date('2026-05-14T00:00:00.000Z');
  const product = {
    id: 'product-id',
    name: 'Keyboard',
    price: 99,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new ProductService(repository);
  });

  it('finds all products through ProductRepository', async () => {
    vi.mocked(repository.findAll).mockResolvedValue([product]);

    await expect(service.findAll()).resolves.toEqual([product]);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('finds a product by id through ProductRepository', async () => {
    vi.mocked(repository.findById).mockResolvedValue(product);

    await expect(service.findById('product-id')).resolves.toEqual(product);
    expect(repository.findById).toHaveBeenCalledWith('product-id');
  });

  it('creates products through ProductRepository', async () => {
    vi.mocked(repository.create).mockResolvedValue(product);

    await expect(
      service.create({ name: 'Keyboard', price: 99, stock: 10 }),
    ).resolves.toEqual(product);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Keyboard',
      price: 99,
      stock: 10,
    });
  });

  it('throws when finding a missing product', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);

    await expect(service.findById('missing')).rejects.toThrow(ProductNotFoundError);
  });

  it('updates products through ProductRepository', async () => {
    const updated = {
      ...product,
      price: 89,
    };
    vi.mocked(repository.update).mockResolvedValue(updated);

    await expect(service.update('product-id', { price: 89 })).resolves.toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith('product-id', { price: 89 });
  });

  it('throws when updating a missing product', async () => {
    vi.mocked(repository.update).mockResolvedValue(null);

    await expect(service.update('missing', { price: 89 })).rejects.toThrow(
      ProductNotFoundError,
    );
  });

  it('deletes products through ProductRepository', async () => {
    vi.mocked(repository.delete).mockResolvedValue(true);

    await service.delete('product-id');

    expect(repository.delete).toHaveBeenCalledWith('product-id');
  });

  it('throws when deleting a missing product', async () => {
    vi.mocked(repository.delete).mockResolvedValue(false);

    await expect(service.delete('missing')).rejects.toThrow(ProductNotFoundError);
  });
});
