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
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard, AccessGuard(['roles.create']))
  @Post()
  create(@CurrentUser() user: any, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: user?.tenantId ?? '',
      userId: user?.userId ?? '',
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @UseGuards(AuthGuard, AccessGuard(['roles.seeTree']))
  @Get('tree')
  findAllTree() {
    return this.rolesService.findAllTree();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(AuthGuard, AccessGuard(['roles.update']))
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
