import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

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
