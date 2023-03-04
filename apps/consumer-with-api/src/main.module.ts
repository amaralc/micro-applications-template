import { PlanSubscriptionsModule } from '@auth/shared/domains/plan-subscriptions/plan-subscriptions.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
