import type { Prisma } from '../../../../generated/prisma/client';
import { DatabaseService } from '../../../database/database.service';
import type { CreateOrderDto } from '../../domain/dto/order.schema';
import type { Order, OrderItem, OrderStatus } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order.repository';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export class OrderPrismaRepo extends OrderRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.database.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(toEntity);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.database.order.findUnique({
      where: { id },
      include: { items: true },
    });

    return order ? toEntity(order) : null;
  }

  async create(order: CreateOrderDto): Promise<Order> {
    return this.database.$transaction(async (tx) => {
      const productIds = [...new Set(order.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      });
      const priceByProductId = new Map(
        products.map((product) => [product.id, product.price.toNumber()]),
      );
      const items = order.items.map((item) => {
        const unitPrice = priceByProductId.get(item.productId);

        if (unitPrice === undefined) {
          throw new Error(`Product ${item.productId} not found`);
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      });
      const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

      const created = await tx.order.create({
        data: {
          status: 'pending',
          total,
          items: {
            create: items,
          },
        },
        include: { items: true },
      });

      return toEntity(created);
    });
  }

  async cancel(id: string): Promise<Order | null> {
    const exists = await this.database.order.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return null;
    }

    const cancelled = await this.database.order.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { items: true },
    });

    return toEntity(cancelled);
  }
}

function toEntity(order: OrderWithItems): Order {
  return {
    id: order.id,
    status: order.status as OrderStatus,
    total: order.total.toNumber(),
    items: order.items.map(toItemEntity),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function toItemEntity(item: OrderWithItems['items'][number]): OrderItem {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toNumber(),
    lineTotal: item.lineTotal.toNumber(),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
