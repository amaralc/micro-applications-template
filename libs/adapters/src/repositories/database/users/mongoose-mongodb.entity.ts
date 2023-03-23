import { UserEntity } from '@core/domains/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Users' })
export class MongooseUser extends Document implements UserEntity {
  @Prop({ type: String })
  override id!: string;

  @Prop({ type: String })
  email!: string;
}

export const MongooseUserSchema = SchemaFactory.createForClass(MongooseUser);
