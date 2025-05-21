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
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { FilterQuery } from 'mongoose';
import { CurrentUser, UserDto } from '@app/common';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(createReservationDto, user._id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() filterQuery: FilterQuery<any>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.findAll({ ...filterQuery, userId: user._id });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.service.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
