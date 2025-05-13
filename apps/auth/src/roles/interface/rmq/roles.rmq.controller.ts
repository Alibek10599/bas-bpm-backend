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
    @Payload('metadata') metadata: RequestMetadata,
    @Body('body') createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create({
      ...createRoleDto,
      tenantId: metadata.tenantId,
      userId: metadata.userId,
    });
  }

  @MessagePattern('roles.get.list')
  findAll(@Payload('metadata') metadata: RequestMetadata) {
    return this.rolesService.findAll();
  }

  @MessagePattern('roles.get.tree')
  findAllTree(@Payload('metadata') metadata: RequestMetadata) {
    return this.rolesService.findAllTree();
  }

  @MessagePattern('roles.get.one')
  findOne(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') roleIdDto: RoleIdDto,
  ) {
    return this.rolesService.findOne(roleIdDto.roleId);
  }

  @MessagePattern('roles.update')
  update(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(metadata.userId, updateRoleDto.roleId, {
      ...updateRoleDto,
      userId: metadata.userId,
    });
  }
}
