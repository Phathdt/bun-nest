import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import * as yaml from 'js-yaml';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL ?? loadDatabaseUrl();

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

await prisma.product.create({
  data: {
    name: 'Seeded product',
    description: 'Created by Prisma seed',
    price: 12.5,
    stock: 4,
  },
});

await prisma.$disconnect();

function loadDatabaseUrl(): string {
  const configPath = path.join(process.cwd(), 'config', 'config.yml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContents) as {
    database?: {
      url?: string;
    };
  };

  if (!config.database?.url) {
    throw new Error('database.url must be configured in config/config.yml');
  }

  return config.database.url;
}
