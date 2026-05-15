import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from './modules/config';
import {
  CustomLoggerService,
  HttpLoggerMiddleware,
  LoggerModule,
} from './modules/logger';
import { OrderModule } from './modules/orders';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [ConfigModule, LoggerModule, ProductModule, OrderModule],
})
export class AppModule implements NestModule {
  constructor(private readonly logger: CustomLoggerService) {}

  configure(consumer: MiddlewareConsumer): void {
    const httpLogger = new HttpLoggerMiddleware(this.logger);

    consumer.apply(httpLogger.use.bind(httpLogger)).forRoutes({
      path: '{*path}',
      method: RequestMethod.ALL,
    });
  }
}
