import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  resetToken?: string;

  @Prop()
  resetTokenExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
