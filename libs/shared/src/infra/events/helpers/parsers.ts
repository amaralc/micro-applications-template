import { KafkaMessage, Message } from '../types';

export const parseKafkaMessageToMessage: (
  kafkaMessage: KafkaMessage
) => Message = ({ headers, key, timestamp, value }) => ({
  value,
  headers,
  key,
  timestamp,
  partition: 0,
});

export const parseMessageToKafkaMessage: (message: Message) => KafkaMessage = ({
  value,
  headers,
  key,
  timestamp,
}) => {
  let localKey: Buffer | null;
  if (typeof key === 'undefined') {
    localKey = null;
  } else if (typeof key === 'string') {
    localKey = Buffer.from(key);
  } else {
    localKey = key;
  }

  return {
    key: localKey,
    value: typeof value === 'string' ? Buffer.from(value) : value,
    offset: '0',
    attributes: 1,
    headers: headers ?? {},
    timestamp: timestamp ?? new Date().toISOString(),
  };
};
