import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Order } from '../../domain/entities/order.entity';
import type { OrderRepository } from '../../domain/interfaces/order.repository';
import { OrderNotFoundError, OrderService } from './order.service';

describe('OrderService', () => {
  let repository: OrderRepository;
  let service: OrderService;
  const now = new Date('2026-05-14T00:00:00.000Z');
  const order: Order = {
    id: 'order-id',
    status: 'pending',
    total: 20,
    items: [
      {
        id: 'order-item-id',
        orderId: 'order-id',
        productId: 'product-id',
        quantity: 2,
        unitPrice: 10,
        lineTotal: 20,
        createdAt: now,
        updatedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      cancel: vi.fn(),
    };
    service = new OrderService(repository);
  });

  it('finds all orders through OrderRepository', async () => {
    vi.mocked(repository.findAll).mockResolvedValue([order]);

    await expect(service.findAll()).resolves.toEqual([order]);
    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('finds an order by id through OrderRepository', async () => {
    vi.mocked(repository.findById).mockResolvedValue(order);

    await expect(service.findById('order-id')).resolves.toEqual(order);
    expect(repository.findById).toHaveBeenCalledWith('order-id');
  });

  it('throws when finding a missing order', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);

    await expect(service.findById('missing')).rejects.toThrow(OrderNotFoundError);
  });

  it('creates orders through OrderRepository', async () => {
    vi.mocked(repository.create).mockResolvedValue(order);

    await expect(
      service.create({
        items: [{ productId: '00000000-0000-0000-0000-000000000001', quantity: 2 }],
      }),
    ).resolves.toEqual(order);
    expect(repository.create).toHaveBeenCalledWith({
      items: [{ productId: '00000000-0000-0000-0000-000000000001', quantity: 2 }],
    });
  });

  it('cancels orders through OrderRepository', async () => {
    const cancelled = { ...order, status: 'cancelled' as const };
    vi.mocked(repository.cancel).mockResolvedValue(cancelled);

    await expect(service.cancel('order-id')).resolves.toEqual(cancelled);
    expect(repository.cancel).toHaveBeenCalledWith('order-id');
  });

  it('throws when cancelling a missing order', async () => {
    vi.mocked(repository.cancel).mockResolvedValue(null);

    await expect(service.cancel('missing')).rejects.toThrow(OrderNotFoundError);
  });
});
