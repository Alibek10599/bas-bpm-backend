import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RolesService } from '../../application/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CurrentUser } from '@app/common';

@Controller('roles')
export class RolesGrpcController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: user.tenantId,
      userId: user.userId,
    });
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
}
