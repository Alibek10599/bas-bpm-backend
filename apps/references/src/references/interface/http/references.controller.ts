import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ReferencesService } from '../../application/references.service';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { CurrentUser } from '@app/common';
import { HttpUpdateReferenceDto } from './dto/http-update-reference.dto';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() createReferenceDto: CreateReferenceDto,
  ) {
    return this.referencesService.create(
      createReferenceDto,
      user?.userId ?? '',
      user?.tenantId ?? '',
    );
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.referencesService.findAll(user?.tenantId ?? '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateReferenceDto: HttpUpdateReferenceDto,
  ) {
    return this.referencesService.update(
      id,
      updateReferenceDto,
      user?.userId ?? '',
    );
  }
}
