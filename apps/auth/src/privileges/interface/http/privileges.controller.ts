import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PrivilegesService } from '../../application/privileges.service';
import { CreatePrivilegeDto } from '../dto/create-privilege.dto';
import { HttpUpdatePrivilegeDto } from './dto/http-update-privilege.dto';
import { AccessGuard, CurrentUser } from '@app/common';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

@Controller('privileges')
export class PrivilegesController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  @UseGuards(JwtAuthGuard, AccessGuard(['privileges.create']))
  @Post()
  create(@Body() createPrivilegeDto: CreatePrivilegeDto) {
    return this.privilegesService.create(createPrivilegeDto);
  }

  @UseGuards(JwtAuthGuard, AccessGuard(['privileges.seeList']))
  @Get()
  findAll() {
    return this.privilegesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privilegesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AccessGuard(['privileges.update']))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrivilegeDto: HttpUpdatePrivilegeDto,
    @CurrentUser() user: any,
  ) {
    return this.privilegesService.update(
      user?.userId ?? '',
      id,
      updatePrivilegeDto,
    );
  }
}
