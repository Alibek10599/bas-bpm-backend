import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class TemplateDocument extends AbstractDocument {
  static readonly collectionName = 'reservations';

  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop()
  userId: string;
}

export const TemplateSchema = SchemaFactory.createForClass(TemplateDocument);
