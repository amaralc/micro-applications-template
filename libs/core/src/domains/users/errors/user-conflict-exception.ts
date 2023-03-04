import { ConflictException } from '@nestjs/common';

export class UserConflictException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
