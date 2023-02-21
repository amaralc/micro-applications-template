import { ConflictException } from '@nestjs/common';
import { USERS_ERROR_MESSAGES } from './error-messages';

export class UserConflictException extends ConflictException {
  constructor() {
    super([USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']]);
  }
}
