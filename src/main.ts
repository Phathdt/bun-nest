import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomConfigService } from './modules/config';

const app = await NestFactory.create(AppModule);

app.setGlobalPrefix('api');

const config = app.get(CustomConfigService);
const port = config.host.port;
const host = config.host.host;

await app.listen(port, host);

console.log(`Products API listening on http://${host}:${port}/api`);
