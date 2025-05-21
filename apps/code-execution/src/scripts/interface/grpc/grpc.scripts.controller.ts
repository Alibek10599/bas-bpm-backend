import { Controller, UseInterceptors } from '@nestjs/common';
import { ScriptsService } from '../../application/scripts.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { MessageMetadata } from '../dto/message.metadata';
import { CreateScriptDto } from '../dto/create-script.dto';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { UpdateScriptDto } from '../dto/update-script.dto';
import { ScriptIdDto } from '../dto/script-id.dto';
import { ProgrammingLanguageEnumInterceptor } from './interceptors/programming-language-enum.interceptor';

@Controller()
export class GrpcScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @UseInterceptors(ProgrammingLanguageEnumInterceptor)
  @GrpcMethod('ScriptsService', 'CreateScript')
  async create(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') createScriptDto: CreateScriptDto,
  ) {
    return await this.scriptsService.create({
      name: createScriptDto.name,
      language: createScriptDto.language,
      script: createScriptDto.script,
      tenantId: metadata?.tenantId ?? '',
      userId: metadata?.userId ?? '',
    });
  }

  @GrpcMethod('ScriptsService', 'FindAllScripts')
  async findAll(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') filter: FindAllScriptsFilterDto,
  ) {
    const result = await this.scriptsService.findAll({
      ...filter,
      userId: metadata.userId,
      tenantId: metadata.tenantId,
    });
    return {
      items: result,
    };
  }

  @GrpcMethod('ScriptsService', 'FindOneScript')
  findOne(@Payload('body') body: ScriptIdDto) {
    return this.scriptsService.findOne(body.scriptId);
  }

  @UseInterceptors(ProgrammingLanguageEnumInterceptor)
  @GrpcMethod('ScriptsService', 'UpdateScript')
  async update(@Payload('body') updateScriptDto: UpdateScriptDto) {
    return await this.scriptsService.update(
      updateScriptDto.scriptId,
      updateScriptDto,
    );
  }
}
