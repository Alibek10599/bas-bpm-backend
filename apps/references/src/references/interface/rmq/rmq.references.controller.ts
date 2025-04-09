import { Controller } from '@nestjs/common';
import { ReferencesService } from '../../application/references.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { UpdateReferenceDto } from '../dto/update-reference.dto';
import { GetReferencesByIdDto } from '../dto/get-references-by-id.dto';

@Controller()
export class RmqReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @MessagePattern('references.create')
  create(
    @Payload('body') createReferenceDto: CreateReferenceDto,
    @Payload('metadata') metadata: any,
  ) {
    return this.referencesService.create(
      {
        ...createReferenceDto,
      },
      metadata.userId,
      metadata.tenantId,
    );
  }

  @MessagePattern('references.update')
  update(
    @Payload('body') updateReferenceDto: UpdateReferenceDto,
    @Payload('metadata') metadata: any,
  ) {
    return this.referencesService.update(
      updateReferenceDto.referenceId,
      {
        ...updateReferenceDto,
      },
      metadata.userId,
    );
  }

  @MessagePattern('references.get.list')
  findAll(@Payload('metadata') metadata: any) {
    return this.referencesService.findAll(metadata.tenantId);
  }

  @MessagePattern('references.get.one')
  findOne(@Payload('body') body: GetReferencesByIdDto) {
    return this.referencesService.findOne(body.referenceId);
  }
}
