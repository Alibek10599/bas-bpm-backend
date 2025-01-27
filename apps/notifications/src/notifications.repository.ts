import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationDocument } from './models/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class notificationsRepository extends AbstractRepository<NotificationDocument> {
  protected readonly logger = new Logger(notificationsRepository.name);

  constructor(
    @InjectModel(NotificationDocument.collectionName)
    NotificationModel: Model<NotificationDocument>,
  ) {
    super(NotificationModel);
  }
}
