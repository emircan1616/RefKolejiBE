import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  tcNo: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  mentor: string;

  @Prop({ required: false })
  studentPassword: string;

  @Prop({ required: false })
  parentPassword: string;

  @Prop({ required: true, unique: true })
  parentTcNo: string;

  @Prop({ required: true })
  parentPhoneNumber: string;

  @Prop({ required: true })
  parentEmail: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);