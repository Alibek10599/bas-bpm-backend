import { Controller } from '@nestjs/common';
import { ScriptsService } from '../../application/scripts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateScriptDto } from '../dto/create-script.dto';
import { MessageMetadata } from '../dto/message.metadata';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { UpdateScriptDto } from '../dto/update-script.dto';
import { ScriptIdDto } from '../dto/script-id.dto';

@Controller()
export class RmqScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @MessagePattern('scripts.create')
  create(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') createScriptDto: CreateScriptDto,
  ) {
    return this.scriptsService.create({
      name: createScriptDto.name,
      script: createScriptDto.script,
      tenantId: metadata?.tenantId ?? '',
      userId: metadata?.userId ?? '',
    });
  }

  @MessagePattern('scripts.find-all')
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

  @MessagePattern('scripts.find-one')
  findOne(@Payload('body') body: ScriptIdDto) {
    return this.scriptsService.findOne(body.scriptId);
  }

  @MessagePattern('scripts.update')
  update(@Payload('body') updateScriptDto: UpdateScriptDto) {
    return this.scriptsService.update(
      updateScriptDto.scriptId,
      updateScriptDto,
    );
  }
}
