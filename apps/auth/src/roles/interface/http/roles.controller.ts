import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../../application/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { AccessGuard, CurrentUser } from '@app/common';
import { HttpUpdateRoleDto } from './dto/http-update-role.dto';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, AccessGuard(['roles.create']))
  @Post()
  create(@CurrentUser() user: any, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: user?.tenantId ?? '',
      userId: user?.userId ?? '',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @UseGuards(JwtAuthGuard, AccessGuard(['roles.seeTree']))
  @Get('tree')
  findAllTree() {
    return this.rolesService.findAllTree();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AccessGuard(['roles.update']))
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
