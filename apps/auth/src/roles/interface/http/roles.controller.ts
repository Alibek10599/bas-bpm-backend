import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { RolesService } from '../../application/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CurrentUser } from '@app/common';
import { HttpUpdateRoleDto } from './dto/http-update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: user?.tenantId ?? '',
      userId: user?.userId ?? '',
    });
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('tree')
  findAllTree() {
    return this.rolesService.findAllTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: HttpUpdateRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.rolesService.update(user.userId, id, {
      ...updateRoleDto,
      userId: user.userId,
    });
  }
}
