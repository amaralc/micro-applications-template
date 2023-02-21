import { ValidationError } from 'class-validator';
import { ValidationException } from './validation-exception';

export class InvalidJsonString extends ValidationException {
  constructor() {
    super([new ValidationError()], 'Invalid JSON string');
  }
}
