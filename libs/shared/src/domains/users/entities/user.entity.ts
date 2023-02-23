import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export interface IUserProps {
  id: string;
  email: string;
}

export interface IMakeUserProps {
  id?: string;
  email: string;
}

export class User {
  id: IUserProps['id'];
  email: IUserProps['email'];

  constructor({ email, id }: IMakeUserProps) {
    this.id = id ?? randomUUID();
    this.email = email;
  }
}

@Schema({ collection: 'users' })
export class MongooseUser extends Document implements User {
  @Prop({ type: String })
  override id!: IUserProps['id'];

  @Prop({ type: String })
  email!: IUserProps['email'];
}

export const MongooseUserSchema = SchemaFactory.createForClass(MongooseUser);
