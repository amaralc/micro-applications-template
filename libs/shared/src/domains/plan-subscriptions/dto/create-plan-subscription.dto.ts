import { IsString } from 'class-validator';

export abstract class CreatePlanSubscriptionDto {
  @IsString()
  email!: string;

  @IsString()
  plan!: string;
}
