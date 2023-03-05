export interface IHeaders {
  [key: string]: Buffer | string | (Buffer | string)[] | undefined;
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
