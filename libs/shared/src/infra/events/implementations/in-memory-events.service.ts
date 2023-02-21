import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EventsService } from '../events.service';
import { parseMessageToKafkaMessage } from '../helpers/parsers';
import { makeEachMessagePayloadMock } from '../tests/factories/each-message-payload.factory';
import {
  EachMessageHandler,
  InMemoryEventsManager,
  InMemoryMessages,
  ProducerRecord,
} from '../types';

const className = 'InMemoryEventsService';

@Injectable()
export class InMemoryEventsService implements EventsService {
  /**
   * eventsManager data format:
   * { topic: { id: callback } }
   */
  eventsManager: InMemoryEventsManager = {};
  messages: InMemoryMessages = {};

  async onModuleInit(): Promise<void> {
    Logger.log('Initializing in memory events manager...');
  }

  async publish(payload: ProducerRecord): Promise<void> {
    const { topic } = payload;

    if (!this.messages[topic]) {
      Logger.log('Initializing topic...', className);
      this.messages[topic] = [];
    }

    this.messages[topic].push(payload);
    Logger.log('Message published: ' + JSON.stringify(payload), className);

    // If there are no subscribers, do nothing
    if (!this.eventsManager[topic]) {
      return;
    }

    // Execute consumer callbacks for this topic
    Object.keys(this.eventsManager[topic]).forEach((id) => {
      Logger.log(`Executing callback for consumer id ${id}`, className);
      this.eventsManager[topic][id](payload);
    });
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
    const id = randomUUID();
    if (!this.eventsManager[topic]) {
      this.eventsManager[topic] = {};
    }

    this.eventsManager[topic][id] = async ({ topic, messages }) => {
      const kafkaMessages = messages.map((message) => {
        const kafkaMessage = parseMessageToKafkaMessage(message);
        return kafkaMessage;
      });

      kafkaMessages.forEach((kafkaMessage) => {
        callback(
          makeEachMessagePayloadMock({
            topic,
            message: kafkaMessage,
          })
        );
      });
    };
  }
}
