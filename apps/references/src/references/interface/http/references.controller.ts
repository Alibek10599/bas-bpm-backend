import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferencesService } from '../../application/references.service';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { AccessGuard, CurrentUser } from '@app/common';
import { HttpUpdateReferenceDto } from './dto/http-update-reference.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @UseGuards(AuthGuard, AccessGuard(['references.create']))
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

  @UseGuards(AuthGuard)
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.referencesService.findAll(user?.tenantId ?? '');
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referencesService.findOne(id);
  }

  @UseGuards(AuthGuard, AccessGuard(['references.update']))
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
