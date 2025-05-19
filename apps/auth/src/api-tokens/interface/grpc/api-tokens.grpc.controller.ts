import { Controller } from '@nestjs/common';
import { ApiTokensService } from '../../application/api-tokens.service';
import { CreateApiTokenDto } from '../dto/create-api-token.dto';
import { UpdateApiTokenDto } from '../dto/update-api-token.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '@app/common';
import { ApiTokenIdDto } from '../dto/api-token-id.dto';
import { FindAllApiTokenFilterDto } from '../dto/find-all-api-token-filter.dto';
import { ApiTokenTokenDto } from '../dto/api-token-token.dto';

@Controller()
export class ApiTokensGrpcController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @GrpcMethod('ApiTokensService', 'Create')
  create(
    @Payload('body') createApiTokenDto: CreateApiTokenDto,
    @Payload('metadata') metadata: RequestMetadata,
  ) {
    return this.apiTokensService.create({
      ...createApiTokenDto,
      tenantId: metadata.tenantId,
      userId: metadata.userId,
    });
  }

  @GrpcMethod('ApiTokensService', 'FindAll')
  async findAll(
    @Payload('body') findAllApiTokenFilterDto: FindAllApiTokenFilterDto,
  ) {
    const items = await this.apiTokensService.findAll(findAllApiTokenFilterDto);
    return {
      items,
    };
  }

  @GrpcMethod('ApiTokensService', 'FindOne')
  findOne(@Payload('body') body: ApiTokenIdDto) {
    return this.apiTokensService.findOne(body.apiTokenId);
  }

  @GrpcMethod('ApiTokensService', 'FindOne')
  findOneByToken(@Payload('body') body: ApiTokenTokenDto) {
    return this.apiTokensService.findOne(body.token);
  }

  @GrpcMethod('ApiTokensService', 'Update')
  update(@Payload('body') updateApiTokenDto: UpdateApiTokenDto) {
    return this.apiTokensService.update(
      updateApiTokenDto.apiTokenId,
      updateApiTokenDto,
    );
  }

  @GrpcMethod('ApiTokensService', 'Remove')
  remove(@Payload('body') body: ApiTokenIdDto) {
    return this.apiTokensService.remove(body.apiTokenId);
  }
}
