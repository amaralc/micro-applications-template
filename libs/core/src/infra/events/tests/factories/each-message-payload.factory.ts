import { EachMessagePayload } from '../../types';
import { makeKafkaMessageMock } from './kafka-message.factory';

type Override = Partial<EachMessagePayload>;

export const makeEachMessagePayloadMock = (override: Override): EachMessagePayload => {
  return {
    topic: 'topic',
    message: makeKafkaMessageMock({
      value: Buffer.from('{"key":"value"}'),
    }),
    partition: 0,
    heartbeat: () => Promise.resolve(console.log('heartbeat')),
    pause: () => () => console.log('pause'),
    ...override,
  };
};
