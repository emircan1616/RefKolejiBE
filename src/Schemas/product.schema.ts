import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: true })
  isDeleted: boolean;

  @Prop({ required: true })
  createDate: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
