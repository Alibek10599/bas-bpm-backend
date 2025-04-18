import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ScriptsService } from '../../application/scripts.service';
import { CreateScriptDto } from '../dto/create-script.dto';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { CurrentUser } from '@app/common';
import { HttpUpdateScriptDto } from './dto/http.update-script.dto';

@Controller('scripts')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createScriptDto: CreateScriptDto) {
    return this.scriptsService.create({
      name: createScriptDto.name,
      script: createScriptDto.script,
      tenantId: user?.tenantId ?? '',
      userId: user?.userId ?? '',
    });
  }

  @Get()
  findAll(@Query() filter: FindAllScriptsFilterDto) {
    return this.scriptsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scriptsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScriptDto: HttpUpdateScriptDto,
  ) {
    return this.scriptsService.update(id, updateScriptDto);
  }
}
