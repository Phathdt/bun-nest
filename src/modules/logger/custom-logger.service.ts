import type { LoggerService } from '@nestjs/common';
import pino, { type Logger, type LoggerOptions } from 'pino';
import { CustomConfigService } from '../config';

export class CustomLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(config: CustomConfigService) {
    this.logger = pino({
      level: config.logger.level,
      base: undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
      ...getFormatOptions(config.logger.format),
    });
  }

  log(message: unknown, context?: string): void {
    this.logger.info({ context }, normalizeMessage(message));
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, normalizeMessage(message));
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn({ context }, normalizeMessage(message));
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug({ context }, normalizeMessage(message));
  }

  verbose(message: unknown, context?: string): void {
    this.logger.trace({ context }, normalizeMessage(message));
  }

  fatal(message: unknown, context?: string): void {
    this.logger.fatal({ context }, normalizeMessage(message));
  }
}

function getFormatOptions(format: 'json' | 'text'): LoggerOptions {
  if (format === 'text') {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          translateTime: 'SYS:standard',
        },
      },
    };
  }

  return {};
}

function normalizeMessage(message: unknown): string {
  if (message instanceof Error) {
    return message.message;
  }

  if (typeof message === 'string') {
    return message;
  }

  return JSON.stringify(message);
}
