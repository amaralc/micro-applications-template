import { NativeLogger } from '@core/shared/logs/native-logger';
import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggingMiddleware(new NativeLogger())).toBeDefined();
  });
});
