import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PrivilegesService } from '../../application/privileges.service';
import { CreatePrivilegeDto } from '../dto/create-privilege.dto';
import { HttpUpdatePrivilegeDto } from './dto/http-update-privilege.dto';
import { CurrentUser } from '@app/common';

@Controller('privileges')
export class PrivilegesController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  @Post()
  create(@Body() createPrivilegeDto: CreatePrivilegeDto) {
    return this.privilegesService.create(createPrivilegeDto);
  }

  @Get()
  findAll() {
    return this.privilegesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privilegesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrivilegeDto: HttpUpdatePrivilegeDto,
    @CurrentUser() user: any,
  ) {
    return this.privilegesService.update(user.userId, id, updatePrivilegeDto);
  }
}
