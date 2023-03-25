import { ApplicationLogger } from './application-logger';

export class NativeLogger implements ApplicationLogger {
  info(message: string, metadata: Record<string, unknown>): void {
    console.log(message, metadata);
  }
  warn(message: string, metadata: Record<string, unknown>): void {
    console.log(message, metadata);
  }
  error(message: string, metadata: Record<string, unknown>): void {
    console.log(message, metadata);
  }
  debug(message: string, metadata: Record<string, unknown>): void {
    console.log(message, metadata);
  }
}
