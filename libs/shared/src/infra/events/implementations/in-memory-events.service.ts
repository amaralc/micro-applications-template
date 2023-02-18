import { Injectable } from '@nestjs/common';
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

  async publish(payload: ProducerRecord): Promise<void> {
    const { topic } = payload;
    if (!this.eventsManager[topic]) {
      return;
    }

    Object.keys(this.eventsManager[topic]).forEach((key) =>
      this.eventsManager[topic][key](payload)
    );
  }

  async subscribe(
    topic: string,
    callback: (payload: ProducerRecord) => Promise<void>
  ): Promise<void> {
    const id = randomUUID();
    this.eventsManager[topic][id] = callback;
  }

  async onModuleInit(): Promise<void> {
    console.log('initializing');
  }
}
