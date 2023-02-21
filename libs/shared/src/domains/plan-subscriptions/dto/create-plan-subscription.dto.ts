import { IsBoolean, IsString, IsUUID } from 'class-validator';

export interface ICreatePlanSubscriptionDtoProps {
  id?: string;
  isActive?: boolean;
  email: string;
  plan: string;
}

export class CreatePlanSubscriptionDto {
  @IsUUID()
  id?: ICreatePlanSubscriptionDtoProps['id'];

  @IsBoolean()
  isActive?: ICreatePlanSubscriptionDtoProps['isActive'];

  @IsString()
  email!: ICreatePlanSubscriptionDtoProps['email'];

  @IsString()
  plan!: ICreatePlanSubscriptionDtoProps['plan'];

  constructor(props: ICreatePlanSubscriptionDtoProps) {
    this.id = props.id;
    this.email = props.email;
    this.plan = props.plan;
    this.isActive = props.isActive;
  }
}
