import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfirmEmailDocument = ConfirmEmail & Document;

@Schema()
export class ConfirmEmail {
  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  email: string;
}

export const ConfirmEmailSchema = SchemaFactory.createForClass(ConfirmEmail);
