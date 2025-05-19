import { Controller } from '@nestjs/common';
import { ApiTokensService } from '../../application/api-tokens.service';
import { CreateApiTokenDto } from '../dto/create-api-token.dto';
import { UpdateApiTokenDto } from '../dto/update-api-token.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '@app/common';
import { ApiTokenIdDto } from '../dto/api-token-id.dto';
import { ApiTokenTokenDto } from '../dto/api-token-token.dto';

@Controller()
export class ApiTokensRmqController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @MessagePattern('api-token.create')
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

  @MessagePattern('api-token.find-all')
  findAll() {
    return this.apiTokensService.findAll();
  }

  @MessagePattern('api-token.find-one')
  findOne(@Payload('body') body: ApiTokenIdDto) {
    return this.apiTokensService.findOne(body.apiTokenId);
  }

  @MessagePattern('api-token.find-one-by-token')
  findOneByToken(@Payload('body') body: ApiTokenTokenDto) {
    return this.apiTokensService.findOne(body.token);
  }

  @MessagePattern('api-token.update')
  update(@Payload('body') updateApiTokenDto: UpdateApiTokenDto) {
    return this.apiTokensService.update(
      updateApiTokenDto.apiTokenId,
      updateApiTokenDto,
    );
  }

  @MessagePattern('api-token.delete')
  remove(@Payload('body') body: ApiTokenIdDto) {
    return this.apiTokensService.remove(body.apiTokenId);
  }
}
