import { Controller } from '@nestjs/common';
import { PrivilegesService } from '../../application/privileges.service';
import { CreatePrivilegeDto } from '../dto/create-privilege.dto';
import { UpdatePrivilegeDto } from '../dto/update-privilege.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PrivilegeIdDto } from '../dto/privilege-id.dto';
import { RequestMetadata } from '@app/common';

@Controller()
export class PrivilegesGrpcController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  @GrpcMethod('PrivilegesService', 'CreatePrivilege')
  create(
    @Payload('body') createPrivilegeDto: CreatePrivilegeDto,
    @Payload('metadata') requestMetadata: RequestMetadata,
  ) {
    return this.privilegesService.create({
      ...createPrivilegeDto,
      userId: requestMetadata.userId,
      tenantId: requestMetadata.tenantId,
    });
  }

  @GrpcMethod('PrivilegesService', 'FindAll')
  async findAll() {
    const items = await this.privilegesService.findAll();
    return { items };
  }

  @GrpcMethod('PrivilegesService', 'FindOne')
  async findOne(@Payload('body') body: PrivilegeIdDto) {
    return this.privilegesService.findOne(body.privilegeId);
  }

  @GrpcMethod('PrivilegesService', 'UpdatePrivilege')
  update(@Payload('body') updatePrivilegeDto: UpdatePrivilegeDto) {
    return this.privilegesService.update(
      updatePrivilegeDto.privilegeId,
      updatePrivilegeDto,
    );
  }
}
