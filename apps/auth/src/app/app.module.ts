import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [UsersModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
