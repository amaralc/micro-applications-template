import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EventsService } from '../events.service';
import { InMemoryEventsManager, ProducerRecord } from '../types';

@Injectable()
export class InMemoryEventsService implements EventsService {
  /**
   * eventsManager data format:
   * { topic: { id: callback } }
   */
  eventsManager: InMemoryEventsManager = {};
  messages: { [topic: string]: Array<ProducerRecord> } = {};

  async publish(payload: ProducerRecord): Promise<void> {
    const { topic } = payload;

    if (!this.messages[topic]) {
      Logger.log('Initializing topic...');
      this.messages[topic] = [];
    }

    Logger.log('Publishing new message...');
    this.messages[topic].push(payload);
    console.log('Messages: ', this.messages);

    // If there are no subscribers, do nothing
    if (!this.eventsManager[topic]) {
      return;
    }

    // Execute consumer callbacks for this topic
    Object.keys(this.eventsManager[topic]).forEach((id) => {
      Logger.log(`Executing callback for consumer id ${id}`);
      this.eventsManager[topic][id](payload);
    });
  }

  async subscribe(
    topic: string,
    callback: (payload: ProducerRecord) => Promise<void>
  ): Promise<void> {
    const id = randomUUID();
    this.eventsManager[topic][id] = callback;
  }

  async onModuleInit(): Promise<void> {
    Logger.log('Initializing in memory events manager...');
  }
}
