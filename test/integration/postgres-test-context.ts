import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DatabaseService } from '../../src/modules/database/database.service';

const execFileAsync = promisify(execFile);

export type PostgresTestContext = {
  container: StartedPostgreSqlContainer;
  database: DatabaseService;
  restoreEnvironment(): Promise<void>;
};

export async function setupPostgresTestContext(): Promise<PostgresTestContext> {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  const container = await new PostgreSqlContainer('postgres:17-alpine')
    .withDatabase('bun_nest_test')
    .withUsername('app')
    .withPassword('app')
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();
  await migrate();
  await seed();

  const database = new DatabaseService();
  await database.$connect();

  return {
    container,
    database,
    async restoreEnvironment() {
      await database.$disconnect();
      await container.stop();

      if (previousDatabaseUrl) {
        process.env.DATABASE_URL = previousDatabaseUrl;
      } else {
        delete process.env.DATABASE_URL;
      }
    },
  };
}

export async function resetPostgresTestData(database: DatabaseService): Promise<void> {
  await database.product.deleteMany();
}

async function migrate(): Promise<void> {
  await execFileAsync('bunx', ['--bun', 'prisma', 'migrate', 'deploy']);
}

async function seed(): Promise<void> {
  await execFileAsync('bunx', ['--bun', 'prisma', 'db', 'seed']);
}
