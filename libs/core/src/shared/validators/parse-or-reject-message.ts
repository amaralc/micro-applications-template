import { ValidationException } from '../errors/validation-exception';

export function parseOrRejectMessage(message: unknown) {
  let parsedMessage = null;
  if (Array.isArray(message) || message === null) {
    throw new ValidationException([], 'Invalid JSON object');

    // if string or buffer, convert to json object
  } else if (typeof message === 'string' || message instanceof Buffer) {
    parsedMessage = JSON.parse(message.toString());

    // if json object, use it
  } else if (typeof message === 'object') {
    parsedMessage = message;
  }
  return parsedMessage;
}
