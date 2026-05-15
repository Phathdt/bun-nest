import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { OrderNotFoundError } from './application/services/order.service';
import { createOrderSchema, type CreateOrderDto } from './domain/dto/order.schema';
import type { Order } from './domain/entities/order.entity';
import { OrderServicePort } from './domain/interfaces/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderServicePort) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.withHttpErrors(() => this.orderService.findById(id));
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createOrderSchema)) dto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(dto);
  }

  @Patch(':id/cancel')
  @HttpCode(200)
  cancel(@Param('id') id: string): Promise<Order> {
    return this.withHttpErrors(() => this.orderService.cancel(id));
  }

  private async withHttpErrors<T>(handler: () => Promise<T>): Promise<T> {
    try {
      return await handler();
    } catch (error) {
      if (error instanceof OrderNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
