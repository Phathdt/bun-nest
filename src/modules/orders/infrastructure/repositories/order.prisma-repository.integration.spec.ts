import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseService } from '../../../database/database.service';
import {
  resetPostgresTestData,
  setupPostgresTestContext,
  type PostgresTestContext,
} from '../../../../../test/integration/postgres-test-context';
import { OrderPrismaRepo } from './order.prisma-repository';

describe('OrderPrismaRepo', () => {
  let context: PostgresTestContext;
  let database: DatabaseService;
  let repository: OrderPrismaRepo;

  beforeAll(async () => {
    context = await setupPostgresTestContext();
    database = context.database;
    repository = new OrderPrismaRepo(database);
  });

  beforeEach(async () => {
    await resetPostgresTestData(database);
  });

  afterAll(async () => {
    await context?.restoreEnvironment();
  });

  it('creates and finds orders with priced items', async () => {
    const product = await seedProduct(database, 25);

    const order = await repository.create({
      items: [{ productId: product.id, quantity: 2 }],
    });

    expect(order).toMatchObject({
      status: 'pending',
      total: 50,
      items: [
        expect.objectContaining({
          productId: product.id,
          quantity: 2,
          unitPrice: 25,
          lineTotal: 50,
        }),
      ],
    });
    await expect(repository.findById(order.id)).resolves.toEqual(order);
    await expect(repository.findAll()).resolves.toEqual([order]);
  });

  it('cancels existing orders and returns null for missing orders', async () => {
    const product = await seedProduct(database, 10);
    const order = await repository.create({
      items: [{ productId: product.id, quantity: 1 }],
    });

    await expect(repository.cancel(order.id)).resolves.toMatchObject({
      id: order.id,
      status: 'cancelled',
    });
    await expect(repository.cancel(crypto.randomUUID())).resolves.toBeNull();
  });
});

async function seedProduct(database: DatabaseService, price: number) {
  return database.product.create({
    data: {
      name: `Product ${price}`,
      price,
      stock: 10,
    },
  });
}
