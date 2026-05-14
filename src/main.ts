import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const app = await NestFactory.create(AppModule);

app.setGlobalPrefix('api');

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '0.0.0.0';

await app.listen(port, host);

console.log(`Products API listening on http://${host}:${port}/api`);
