import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { OrderService } from './application/services/order.service';
import { OrderRepository } from './domain/interfaces/order.repository';
import { OrderServicePort } from './domain/interfaces/order.service';
import { OrderPrismaRepo } from './infrastructure/repositories/order.prisma-repository';
import { OrderController } from './order.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    {
      provide: OrderRepository,
      useFactory: (database: DatabaseService) => new OrderPrismaRepo(database),
      inject: [DatabaseService],
    },
    {
      provide: OrderServicePort,
      useFactory: (repository: OrderRepository) => new OrderService(repository),
      inject: [OrderRepository],
    },
  ],
  exports: [OrderServicePort, OrderRepository],
})
export class OrderModule {}
