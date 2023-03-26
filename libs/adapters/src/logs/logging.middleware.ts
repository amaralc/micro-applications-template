import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: ApplicationLogger) {}

  use(req: Request, res: Response, next: () => void) {
    const start = Number(new Date());
    res.on('finish', () => {
      const end = Number(new Date());
      this.logger.info('Logging middleware', {
        className: LoggingMiddleware.name,
        latencyInMs: end - start,
      });
    });
    next();
  }
}
