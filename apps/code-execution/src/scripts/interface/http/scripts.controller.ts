import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScriptsService } from '../../application/scripts.service';
import { CreateScriptDto } from '../dto/create-script.dto';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { AccessGuard, CurrentUser } from '@app/common';
import { HttpUpdateScriptDto } from './dto/http.update-script.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('scripts')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @UseGuards(AuthGuard, AccessGuard(['codeExecution.scripts.create']))
  @Post()
  create(@CurrentUser() user: any, @Body() createScriptDto: CreateScriptDto) {
    return this.scriptsService.create({
      name: createScriptDto.name,
      script: createScriptDto.script,
      language: createScriptDto.language,
      tenantId: user?.tenantId ?? '',
      userId: user?.userId ?? '',
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() filter: FindAllScriptsFilterDto) {
    return this.scriptsService.findAll(filter);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scriptsService.findOne(id);
  }

  @UseGuards(AuthGuard, AccessGuard(['codeExecution.scripts.update']))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScriptDto: HttpUpdateScriptDto,
  ) {
    return this.scriptsService.update(id, updateScriptDto);
  }
}
