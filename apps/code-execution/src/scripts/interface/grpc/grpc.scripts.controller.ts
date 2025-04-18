import { Controller } from '@nestjs/common';
import { ScriptsService } from '../../application/scripts.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { MessageMetadata } from '../dto/message.metadata';
import { CreateScriptDto } from '../dto/create-script.dto';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { UpdateScriptDto } from '../dto/update-script.dto';
import { ScriptIdDto } from '../dto/script-id.dto';

@Controller()
export class GrpcScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @GrpcMethod('ScriptsService', 'CreateScript')
  create(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') createScriptDto: CreateScriptDto,
  ) {
    return this.scriptsService.create({
      name: createScriptDto.name,
      language: createScriptDto.language,
      script: createScriptDto.script,
      tenantId: metadata?.tenantId ?? '',
      userId: metadata?.userId ?? '',
    });
  }

  @GrpcMethod('ScriptsService', 'FindAllScripts')
  findAll(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') filter: FindAllScriptsFilterDto,
  ) {
    return this.scriptsService.findAll({
      ...filter,
      userId: metadata.userId,
      tenantId: metadata.tenantId,
    });
  }

  @GrpcMethod('ScriptsService', 'FindOneScript')
  findOne(@Payload('body') body: ScriptIdDto) {
    return this.scriptsService.findOne(body.scriptId);
  }

  @GrpcMethod('ScriptsService', 'UpdateScript')
  update(@Payload('body') updateScriptDto: UpdateScriptDto) {
    return this.scriptsService.update(
      updateScriptDto.scriptId,
      updateScriptDto,
    );
  }
}
