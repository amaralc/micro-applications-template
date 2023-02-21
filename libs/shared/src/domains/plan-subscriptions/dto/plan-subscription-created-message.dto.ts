import { IsBoolean, IsEmail, IsString, IsUUID } from 'class-validator';

export class PlanSubscriptionCreatedMessageDto {
  @IsUUID()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  plan!: string;

  @IsBoolean()
  isActive!: boolean;
}
