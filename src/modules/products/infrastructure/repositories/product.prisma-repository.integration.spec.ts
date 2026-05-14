import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseService } from '../../../database/database.service';
import {
  resetPostgresTestData,
  setupPostgresTestContext,
  type PostgresTestContext,
} from '../../../../../test/integration/postgres-test-context';
import { ProductPrismaRepo } from './product.prisma-repository';

describe('ProductPrismaRepo', () => {
  let context: PostgresTestContext;
  let database: DatabaseService;
  let repository: ProductPrismaRepo;

  beforeAll(async () => {
    context = await setupPostgresTestContext();
    database = context.database;
    repository = new ProductPrismaRepo(database);
    await expect(repository.findAll()).resolves.toEqual([
      expect.objectContaining({
        name: 'Seeded product',
        description: 'Created by Prisma seed',
        price: 12.5,
        stock: 4,
      }),
    ]);
  });

  beforeEach(async () => {
    await resetPostgresTestData(database);
  });

  afterAll(async () => {
    await context?.restoreEnvironment();
  });

  it('creates and finds products', async () => {
    const product = await repository.create({
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 99,
      stock: 10,
    });

    await expect(repository.findById(product.id)).resolves.toEqual(product);
    await expect(repository.findAll()).resolves.toEqual([product]);
  });

  it('updates existing products and returns null for missing products', async () => {
    const product = await repository.create({
      name: 'Mouse',
      price: 45,
      stock: 5,
    });

    const updated = await repository.update(product.id, {
      price: 39,
      stock: 3,
    });

    expect(updated).toMatchObject({
      id: product.id,
      name: 'Mouse',
      price: 39,
      stock: 3,
    });
    await expect(repository.update(crypto.randomUUID(), { stock: 1 })).resolves.toBeNull();
  });

  it('deletes existing products and returns false for missing products', async () => {
    const product = await repository.create({
      name: 'Desk',
      price: 250,
      stock: 2,
    });

    await expect(repository.delete(product.id)).resolves.toBe(true);
    await expect(repository.findById(product.id)).resolves.toBeNull();
    await expect(repository.delete(product.id)).resolves.toBe(false);
  });
});
