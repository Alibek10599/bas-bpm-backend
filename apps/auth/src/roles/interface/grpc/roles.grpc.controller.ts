import { Controller, Body } from '@nestjs/common';
import { RolesService } from '../../application/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '@app/common';
import { RoleIdDto } from '../dto/role-id.dto';

@Controller()
export class RolesGrpcController {
  constructor(private readonly rolesService: RolesService) {}

  @GrpcMethod('RolesService', 'CreateRole')
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

  @GrpcMethod('RolesService', 'FindAll')
  async findAll(@Payload('metadata') metadata: RequestMetadata) {
    const items = await this.rolesService.findAll();
    return { items };
  }

  @GrpcMethod('RolesService', 'GetRolesTree')
  async findAllTree(@Payload('metadata') metadata: RequestMetadata) {
    const items = await this.rolesService.findAllTree();
    return { items };
  }

  @GrpcMethod('RolesService', 'FindOne')
  findOne(
    @Payload('metadata') user: RequestMetadata,
    @Payload('body') roleIdDto: RoleIdDto,
  ) {
    return this.rolesService.findOne(roleIdDto.roleId);
  }

  @GrpcMethod('RolesService', 'UpdateRole')
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
