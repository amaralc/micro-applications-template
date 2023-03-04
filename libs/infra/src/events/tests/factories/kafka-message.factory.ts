import { randomUUID } from 'crypto';
import { parseMessageToKafkaMessage } from '../../helpers/parsers';
import { KafkaMessage, Message } from '../../types';

type Override = Partial<Message>;

export const makeKafkaMessageMock = (override: Override): KafkaMessage => {
  return parseMessageToKafkaMessage({
    key: Buffer.from(randomUUID()),
    value: Buffer.from('{"key":"value"}'),
    ...override,
  });
};
