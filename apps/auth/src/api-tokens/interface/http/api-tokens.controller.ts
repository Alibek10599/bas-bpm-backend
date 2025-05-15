import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTokensService } from '../../application/api-tokens.service';
import { CreateApiTokenDto } from '../dto/create-api-token.dto';
import { CurrentUser } from '@app/common';
import { HttpUpdateApiTokenDto } from './dto/http.update-api-token.dto';
import { FindAllApiTokenFilterDto } from '../dto/find-all-api-token-filter.dto';

@Controller('api-tokens')
export class ApiTokensController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @Post()
  create(
    @Body() createApiTokenDto: CreateApiTokenDto,
    @CurrentUser() user: any,
  ) {
    return this.apiTokensService.create({
      ...createApiTokenDto,
      tenantId: user?.tenantId,
      userId: user?.userId ?? '',
    });
  }

  @Get()
  findAll(@Query() findAllApiTokenFilterDto: FindAllApiTokenFilterDto) {
    return this.apiTokensService.findAll(findAllApiTokenFilterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiTokensService.findOne(id);
  }

  @Get('/token/:id')
  findOneByToken(@Param('token') token: string) {
    return this.apiTokensService.findOneByToken(token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApiTokenDto: HttpUpdateApiTokenDto,
  ) {
    return this.apiTokensService.update(id, updateApiTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiTokensService.remove(id);
  }
}
