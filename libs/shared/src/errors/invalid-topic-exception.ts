import { ValidationError } from 'class-validator';
import { ValidationException } from './validation-exception';

export class InvalidTopic extends ValidationException {
  constructor() {
    super([new ValidationError()], 'Invalid topic');
  }
}
