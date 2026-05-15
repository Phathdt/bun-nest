import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';

import { URLS, getApiUrl } from '@config/urls.config';
import { logger } from '@utils/logger';

const rootDir = path.resolve(__dirname, '../../..');
const startedProcesses: ChildProcess[] = [];

function shouldStartServers(): boolean {
  return process.env.E2E_START_SERVERS !== 'false';
}

function spawnServer(name: string, args: string[]): ChildProcess {
  const child = spawn('bun', args, {
    cwd: rootDir,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout?.on('data', (chunk) => logger.debug({ name, output: String(chunk) }));
  child.stderr?.on('data', (chunk) => logger.debug({ name, output: String(chunk) }));
  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      logger.warn({ name, code }, 'E2E server exited');
    }
  });

  startedProcesses.push(child);
  return child;
}

async function waitForUrl(url: string, timeoutMs = 45_000): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`);
}

export async function startAppServers(): Promise<void> {
  if (!shouldStartServers()) {
    logger.info('Skipping app server startup');
    return;
  }

  logger.info('Starting backend and web servers for e2e tests');
  spawnServer('backend', ['run', 'backend:dev']);
  spawnServer('web', ['run', 'web:dev']);

  await waitForUrl(getApiUrl('/products'));
  await waitForUrl(URLS.APP);
}

export async function stopAppServers(): Promise<void> {
  for (const child of startedProcesses.splice(0)) {
    child.kill('SIGTERM');
  }
}
