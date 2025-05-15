import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTokensService } from '../../application/api-tokens.service';
import { CreateApiTokenDto } from '../dto/create-api-token.dto';
import { AccessGuard, CurrentUser } from '@app/common';
import { HttpUpdateApiTokenDto } from './dto/http.update-api-token.dto';
import { FindAllApiTokenFilterDto } from '../dto/find-all-api-token-filter.dto';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

@Controller('api-tokens')
export class ApiTokensController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @UseGuards(JwtAuthGuard, AccessGuard(['apiToken.create']))
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

  @UseGuards(JwtAuthGuard, AccessGuard(['apiToken.update']))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApiTokenDto: HttpUpdateApiTokenDto,
  ) {
    return this.apiTokensService.update(id, updateApiTokenDto);
  }

  @UseGuards(JwtAuthGuard, AccessGuard(['apiToken.delete']))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiTokensService.remove(id);
  }
}
