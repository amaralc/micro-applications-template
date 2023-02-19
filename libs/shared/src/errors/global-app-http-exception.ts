import { HttpException, HttpStatus } from '@nestjs/common';

export class GlobalAppHttpException {
  constructor(error: unknown, message?: string, status?: HttpStatus) {
    this.bubbleUpHttpException(error, message, status);
  }

  bubbleUpHttpException(error: unknown, message?: string, status?: HttpStatus) {
    /**
     * Use type guard
     *
     * @see https://youtu.be/xdQkEn3mx1k?t=114
     */
    if (error instanceof HttpException) {
      throw new HttpException(
        message || error.message,
        status || error.getStatus(),
        {
          cause: error,
        }
      );
    }
  }
}
