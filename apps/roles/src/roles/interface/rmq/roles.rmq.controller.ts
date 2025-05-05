import { Controller, Body } from '@nestjs/common';
import { RolesService } from '../../application/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '@app/common';
import { RoleIdDto } from '../dto/role-id.dto';

@Controller()
export class RolesRmqController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('roles.create')
  create(
    @Payload('metadata') user: RequestMetadata,
    @Body('body') createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: user.tenantId,
      userId: user.userId,
    });
  }

  @MessagePattern('roles.get.list')
  findAll(@Payload('metadata') user: RequestMetadata) {
    return this.rolesService.findAll();
  }

  @MessagePattern('roles.get.tree')
  findAllTree(@Payload('metadata') user: RequestMetadata) {
    return this.rolesService.findAllTree();
  }

  @MessagePattern('roles.get.one')
  findOne(
    @Payload('metadata') user: RequestMetadata,
    @Payload('body') roleIdDto: RoleIdDto,
  ) {
    return this.rolesService.findOne(roleIdDto.roleId);
  }

  @MessagePattern('roles.update')
  update(
    @Payload('metadata') user: RequestMetadata,
    @Payload('body') updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(updateRoleDto.roleId, updateRoleDto);
  }
}
