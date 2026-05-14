import type { NextFunction, Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger.service';

export class HttpLoggerMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = performance.now();

    response.on('finish', () => {
      this.logger.info(
        {
          context: 'HTTP',
          method: request.method,
          url: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Math.round(performance.now() - start),
          userAgent: request.headers['user-agent'],
        },
        'request completed',
      );
    });

    next();
  }
}
