export interface IHeaders {
  [key: string]: Buffer | string | (Buffer | string)[] | undefined;
}

interface IMessageSetEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  size: number;
  headers?: never;
}

interface IRecordBatchEntry {
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  attributes: number;
  offset: string;
  headers: IHeaders;
  size?: never;
}

export type IKafkaMessage = IMessageSetEntry | IRecordBatchEntry;

export interface ISimplifiedProducerRecord {
  topic: string;
  messages: Array<{ key: string; value: string }>;
}
