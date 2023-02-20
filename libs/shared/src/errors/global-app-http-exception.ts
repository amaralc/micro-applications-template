import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ValidationException } from './validation-exception';

export class GlobalAppHttpException {
  constructor(error: unknown, message?: string, status?: HttpStatus) {
    this.bubbleUpHttpException(error, message, status);
    this.bubbleUpValidationException(error, message, status);
  }

  bubbleUpHttpException(error: unknown, message?: string, status?: HttpStatus) {
    /**
     * Use type guard
     *
     * @see https://youtu.be/xdQkEn3mx1k?t=114
     */
    if (error instanceof HttpException) {
      const exceptionMessage = message || error.message;
      const exceptionStatus = status || error.getStatus();
      Logger.warn(exceptionMessage);
      throw new HttpException(exceptionMessage, exceptionStatus, {
        cause: error,
      });
    }
  }

  bubbleUpValidationException(
    error: unknown,
    message?: string,
    status?: HttpStatus
  ) {
    const exceptionMessage = message || 'Validation failed';
    Logger.warn(exceptionMessage);
    if (error instanceof ValidationException) {
      throw new HttpException(
        {
          message: exceptionMessage,
          causes: error.causes,
        },
        status || 400
      );
    }
  }
}
