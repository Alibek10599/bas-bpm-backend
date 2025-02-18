import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { notificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FilterQuery } from 'mongoose';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';

@Controller('notifications')
export class notificationsController {
  // constructor(private readonly service: notificationsService) {}

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // create(
  //   @Body() createNotificationDto: CreateNotificationDto,
  //   @CurrentUser() user: UserDto,
  // ) {
  //   return this.service.create(createNotificationDto, user._id);
  // }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(
  //   @Query() filterQuery: FilterQuery<any>,
  //   @CurrentUser() user: UserDto,
  // ) {
  //   return this.service.findAll({ ...filterQuery, userId: user._id });
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // findOne(@Param('id') id: string) {
  //   return this.service.findOne(id);
  // }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ) {
  //   return this.service.update(id, updateNotificationDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.service.remove(id);
  // }
}
