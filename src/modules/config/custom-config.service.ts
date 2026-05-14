import * as fs from 'node:fs';
import * as path from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import * as yaml from 'js-yaml';
import type { AppConfig } from './config.interface';
import { camelToSnakeCase, convertToCamelCase } from './utils';

@Injectable()
export class CustomConfigService {
  private readonly logger = new Logger(CustomConfigService.name);
  private config!: AppConfig;
  private readonly proxyCache = new WeakMap<object, object>();

  constructor() {
    this.loadConfig();
    this.createPropertyAccessors();
    this.validateConfig();
  }

  get<T = unknown>(key: string): T {
    const keys = key.split('.');
    let value: unknown = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined as T;
      }
    }

    return value as T;
  }

  private createPropertyAccessors(): void {
    this.createPropertiesRecursive(
      this as unknown as Record<string, unknown>,
      this.config as unknown as Record<string, unknown>,
    );
  }

  private createPropertiesRecursive(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): void {
    for (const key of Object.keys(source)) {
      const value = source[key];

      if (Object.prototype.hasOwnProperty.call(target, key)) {
        continue;
      }

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.defineProperty(target, key, {
          get: () => {
            const currentValue = source[key] as object;
            let cachedProxy = this.proxyCache.get(currentValue);

            if (!cachedProxy) {
              const proxy: Record<string, unknown> = {};
              this.createPropertiesRecursive(
                proxy,
                currentValue as Record<string, unknown>,
              );
              this.proxyCache.set(currentValue, proxy);
              cachedProxy = proxy;
            }

            return cachedProxy;
          },
          enumerable: true,
          configurable: false,
        });
      } else {
        Object.defineProperty(target, key, {
          get: () => source[key],
          enumerable: true,
          configurable: false,
        });
      }
    }
  }

  private findProjectRoot(): string {
    let currentDir = process.cwd();

    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, 'config', 'config.yml'))) {
        return currentDir;
      }

      if (
        fs.existsSync(path.join(currentDir, 'config')) &&
        fs.existsSync(path.join(currentDir, 'package.json'))
      ) {
        return currentDir;
      }

      currentDir = path.dirname(currentDir);
    }

    return process.cwd();
  }

  private loadConfig(): void {
    try {
      const projectRoot = this.findProjectRoot();
      const configPath = path.join(projectRoot, 'config', 'config.yml');

      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found at ${configPath}`);
      }

      const fileContents = fs.readFileSync(configPath, 'utf8');
      const rawConfig = yaml.load(fileContents) as Record<string, unknown>;

      if (!rawConfig || typeof rawConfig !== 'object') {
        throw new Error('Invalid YAML configuration format: expected an object');
      }

      this.config = convertToCamelCase(rawConfig) as AppConfig;
      this.overrideWithEnv(this.config as unknown as Record<string, unknown>);
      this.logger.log('Configuration loaded successfully from config.yml');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to load configuration', message);
      throw new Error(`Failed to load configuration: ${message}`);
    }
  }

  private overrideWithEnv(obj: Record<string, unknown>, prefix = ''): void {
    for (const key in obj) {
      const snakeKey = camelToSnakeCase(key).toUpperCase();
      const envKey = prefix ? `${prefix}__${snakeKey}` : snakeKey;
      const value = obj[key];

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        this.overrideWithEnv(value as Record<string, unknown>, envKey);
        continue;
      }

      const envValue = process.env[envKey];
      if (envValue !== undefined) {
        obj[key] = this.parseEnvValue(envValue, value);
      }
    }
  }

  private parseEnvValue(envValue: string, originalValue: unknown): unknown {
    if (originalValue === null || originalValue === undefined) {
      return envValue;
    }

    if (Array.isArray(originalValue)) {
      if (!envValue.trim()) {
        return [];
      }

      return envValue
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    switch (typeof originalValue) {
      case 'number':
        return Number(envValue);
      case 'boolean':
        return envValue.toLowerCase() === 'true';
      default:
        return envValue;
    }
  }

  private validateConfig(): void {
    const errors: string[] = [];
    const isPlaceholder = (value: unknown): boolean =>
      value === 'replace_me' || value === '' || value === null || value === undefined;

    if (isPlaceholder(this.config.database?.url)) {
      errors.push('database.url must be configured');
    }

    if (!this.config.host?.port || this.config.host.port <= 0) {
      errors.push('host.port must be a positive number');
    }

    if (isPlaceholder(this.config.redis?.url)) {
      errors.push('redis.url must be configured');
    }

    if (errors.length > 0) {
      const message = `Configuration validation failed:\n${errors
        .map((error) => `  - ${error}`)
        .join('\n')}`;
      this.logger.error(message);
      throw new Error(message);
    }

    this.logger.log('Configuration validation passed');
  }
}

export interface CustomConfigService extends AppConfig {}
