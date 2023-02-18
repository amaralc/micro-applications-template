import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanSubscriptionsModule } from './app/plan-subscriptions/plan-subscriptions.module';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    PlanSubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
