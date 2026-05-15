import { Global, Module } from '@nestjs/common';
import { ConfigModule, CustomConfigService } from '../config';
import { CustomLoggerService } from './custom-logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CustomLoggerService,
      useFactory: (config: CustomConfigService) => new CustomLoggerService(config),
      inject: [CustomConfigService],
    },
  ],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
