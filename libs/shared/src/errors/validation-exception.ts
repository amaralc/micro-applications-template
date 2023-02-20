import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  causes: Array<Pick<ValidationError, 'property' | 'value' | 'constraints'>>;

  constructor(errors: Array<ValidationError>, message?: string) {
    const exceptionMessage = message || 'Validation exception.';
    super(exceptionMessage);
    this.causes = errors.map((error) => {
      return {
        property: error.property,
        value: error.value,
        constraints: error.constraints,
      };
    });
  }
}
