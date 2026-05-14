import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from './modules/config';
import {
  CustomLoggerService,
  HttpLoggerMiddleware,
  LoggerModule,
} from './modules/logger';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [ConfigModule, LoggerModule, ProductModule],
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
