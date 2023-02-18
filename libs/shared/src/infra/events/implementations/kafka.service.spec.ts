import { Test, TestingModule } from '@nestjs/testing';
import { KafkaEventsService } from './kafka.service';

describe('KafkaEventsService', () => {
  let service: KafkaEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaEventsService],
    }).compile();

    service = module.get<KafkaEventsService>(KafkaEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
