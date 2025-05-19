import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FilterQuery } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from '@app/common';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(AuthGuard, AccessGuard(['user.create']))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @UseGuards(AuthGuard, AccessGuard(['user.update']))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(+id, updateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUser(@Query() filterQuery: FilterQuery<any>) {
    return this.service.findAll(filterQuery);
  }

  @UseGuards(AuthGuard, AccessGuard(['user.delete']))
  @Delete()
  delete(_id: string) {
    return this.service.remove(+_id);
  }
}
