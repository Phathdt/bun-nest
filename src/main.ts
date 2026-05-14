import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomConfigService } from './modules/config';
import { CustomLoggerService } from './modules/logger';

const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
});
const logger = app.get(CustomLoggerService);

app.useLogger(logger);

app.setGlobalPrefix('api');

const config = app.get(CustomConfigService);
const port = config.host.port;
const host = config.host.host;

await app.listen(port, host);

logger.log(`Products API listening on http://${host}:${port}/api`, 'Bootstrap');
