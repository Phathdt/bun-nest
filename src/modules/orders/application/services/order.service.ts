import type { CreateOrderDto } from '../../domain/dto/order.schema';
import type { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order.repository';
import { OrderServicePort } from '../../domain/interfaces/order.service';

export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Order ${id} not found`);
    this.name = 'OrderNotFoundError';
  }
}

export class OrderService extends OrderServicePort {
  constructor(private readonly orderRepository: OrderRepository) {
    super();
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return order;
  }

  create(order: CreateOrderDto): Promise<Order> {
    return this.orderRepository.create(order);
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.orderRepository.cancel(id);

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return order;
  }
}
