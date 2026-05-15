import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { defineConfig } from 'prisma/config';

function loadDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const configPath = resolveConfigPath();
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

function resolveConfigPath(): string {
  const configPath = path.join(process.cwd(), 'config', 'config.yml');
  if (fs.existsSync(configPath)) {
    return configPath;
  }

  const exampleConfigPath = path.join(process.cwd(), 'config', 'config.yml.example');
  if (fs.existsSync(exampleConfigPath)) {
    return exampleConfigPath;
  }

  return configPath;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'bun run prisma/seed.ts',
  },
  datasource: {
    url: loadDatabaseUrl(),
  },
});
