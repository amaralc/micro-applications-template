export interface IHeaders {
  [key: string]: Buffer | string | (Buffer | string)[] | undefined;
}

export interface Message {
  key?: Buffer | string | null;
  value: Buffer | string | null;
  partition?: number;
  headers?: IHeaders;
  timestamp?: string;
}

interface MessageSetEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  size: number;
  headers?: never;
}

interface RecordBatchEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  headers: IHeaders;
  size?: never;
}

export type KafkaMessage = MessageSetEntry | RecordBatchEntry;

export interface EachMessagePayload {
  topic: string;
  partition: number;
  message: KafkaMessage;
  heartbeat(): Promise<void>;
  pause(): () => void;
}

export type EachMessageHandler = (payload: EachMessagePayload) => Promise<void>;

export type ConsumerSubscribeTopics = {
  topics: (string | RegExp)[];
  fromBeginning?: boolean;
};

export enum CompressionTypes {
  None = 0,
  GZIP = 1,
  Snappy = 2,
  LZ4 = 3,
  ZSTD = 4,
}

export interface ProducerRecord {
  topic: string;
  messages: Message[];
  acks?: number;
  timeout?: number;
  compression?: CompressionTypes;
}

export interface TopicMessages {
  topic: string;
  messages: Message[];
}

export interface ProducerBatch {
  acks?: number;
  timeout?: number;
  compression?: CompressionTypes;
  topicMessages?: TopicMessages[];
}

export type RecordMetadata = {
  topicName: string;
  partition: number;
  errorCode: number;
  offset?: string;
  timestamp?: string;
  baseOffset?: string;
  logAppendTime?: string;
  logStartOffset?: string;
};

export type Sender = {
  send(record: ProducerRecord): Promise<RecordMetadata[]>;
  // sendBatch(batch: ProducerBatch): Promise<RecordMetadata[]>;
};

export type Producer = Sender;

export interface Consumer {
  disconnect(): Promise<void>;
  // subscribe(subscription: ConsumerSubscribeTopics): Promise<void>;
}

export type EachMessageCallback = (payload: ProducerRecord) => Promise<void>;

export type InMemoryEventsManager = {
  [topic: string]: { [id: string]: EachMessageCallback };
};
