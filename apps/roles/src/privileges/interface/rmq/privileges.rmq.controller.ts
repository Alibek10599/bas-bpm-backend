import { Controller } from '@nestjs/common';
import { PrivilegesService } from '../../application/privileges.service';
import { CreatePrivilegeDto } from '../dto/create-privilege.dto';
import { UpdatePrivilegeDto } from '../dto/update-privilege.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrivilegeIdDto } from '../dto/privilege-id.dto';
import { RequestMetadata } from '@app/common';

@Controller()
export class PrivilegesRmqController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  @MessagePattern('privilege.create')
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

  @MessagePattern('privilege.find-all')
  findAll() {
    return this.privilegesService.findAll();
  }

  @MessagePattern('privilege.find-one')
  findOne(@Payload('body') body: PrivilegeIdDto) {
    return this.privilegesService.findOne(body.privilegeId);
  }

  @MessagePattern('privilege.update')
  update(@Payload('body') updatePrivilegeDto: UpdatePrivilegeDto) {
    return this.privilegesService.update(
      updatePrivilegeDto.privilegeId,
      updatePrivilegeDto,
    );
  }
}
