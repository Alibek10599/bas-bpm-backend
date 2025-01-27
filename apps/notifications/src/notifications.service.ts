import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { notificationsRepository } from './notifications.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class notificationsService {
  constructor(private readonly repository: notificationsRepository) {}

  create(createNotificationDto: CreateNotificationDto, userId: string) {
    return this.repository.create({
      ...createNotificationDto,
      userId,
    });
  }

  findAll(filterQuery: FilterQuery<any>) {
    return this.repository.find(filterQuery);
  }

  findOne(_id: string) {
    return this.repository.findOne({ _id });
  }

  update(_id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.repository.findOneAndUpdate(
      { _id },
      { $set: updateNotificationDto },
    );
  }

  remove(_id: string) {
    return this.repository.findOneAndDelete({ _id });
  }
}
