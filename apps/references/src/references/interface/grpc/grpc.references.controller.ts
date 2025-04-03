import { Controller } from '@nestjs/common';
import { ReferencesService } from '../../application/references.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { UpdateReferenceDto } from '../dto/update-reference.dto';
import { GetReferencesByIdDto } from '../dto/get-references-by-id.dto';

@Controller()
export class GrpcReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @GrpcMethod('ReferencesService', 'CreateReference')
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

  @GrpcMethod('ReferencesService', 'UpdateReference')
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

  @GrpcMethod('ReferencesService', 'GetReferencesList')
  async findAll(@Payload('metadata') metadata: any) {
    const references = await this.referencesService.findAll(metadata.tenantId);
    return { items: references };
  }

  @GrpcMethod('ReferencesService', 'GetReferencesById')
  findOne(@Payload('body') body: GetReferencesByIdDto) {
    return this.referencesService.findOne(body.referenceId);
  }
}
