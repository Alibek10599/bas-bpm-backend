import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ versionKey: false })
export class NotificationDocument extends AbstractDocument {
  static readonly collectionName = 'notifications';

  @Prop()
  startDate: Date;

  @Prop()
  name: string;

  @Prop()
  endDate: Date;

  @Prop()
  userId: string;

  @Prop()
  placeId: string;

  @Prop()
  invoiceId: string;
}

export const notificationschema =
  SchemaFactory.createForClass(NotificationDocument);
