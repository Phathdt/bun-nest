import type { CreateOrderDto } from '../dto/order.schema';
import type { Order } from '../entities/order.entity';

export abstract class OrderRepository {
  abstract findAll(): Promise<Order[]>;
  abstract findById(id: string): Promise<Order | null>;
  abstract create(order: CreateOrderDto): Promise<Order>;
  abstract cancel(id: string): Promise<Order | null>;
}
