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
}) => ({
  key: typeof key === 'string' ? Buffer.from(key) : null,
  timestamp: timestamp ?? new Date().toISOString(),
  headers: headers ?? {},
  value: typeof value === 'string' ? Buffer.from(value) : null,
  offset: '0',
  attributes: 2,
});
