import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Put,
  Res,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { AccessGuard, CurrentUser } from '@app/common';
import { Response } from 'express';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';
import { CreateEmptyFileDto } from '../dto/create-empty-file.dto';
import { DocumentContentQueryDto } from '../dto/document-content-query.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(AuthGuard, AccessGuard(['files.document.upload']))
  @Post('upload')
  upload(
    @Headers('x-file-name') fileName: string,
    @Headers('x-document-type') documentType: string,
    @Headers('content-type') contentType: string,
    @Body() buffer: Buffer,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.saveFileAndCreateDocument({
      name: fileName,
      type: contentType,
      buffer: buffer,
      documentType: documentType,
      userId: user?.userId ?? '',
      tenantId: user?.tenantId ?? '',
    });
  }

  @UseGuards(AuthGuard, AccessGuard(['files.document.createEmpty']))
  @Post('create')
  create(
    @Body() createEmptyFileDto: CreateEmptyFileDto,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.createEmptyDocument({
      ...createEmptyFileDto,
      userId: user?.userId ?? '',
      tenantId: user?.tenantId ?? '',
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/versions')
  findDocumentVersionsById(@Param('id') id: string) {
    return this.documentsService.findDocumentVersionsById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/versions')
  changeDocumentVersion(
    @Param('id') id: string,
    @Body() { versionId }: ChangeDocumentVersionDto,
  ) {
    return this.documentsService.changeDocumentVersion(id, versionId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/content')
  async findOneContent(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: DocumentContentQueryDto,
  ) {
    const data = await this.documentsService.findOneContent(id, +query.version);
    res.header('Content-Type', data.type);
    res.send(data.buffer);
  }

  @UseGuards(AuthGuard, AccessGuard(['files.document.upload']))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Headers('x-file-name') fileName: string,
    @Headers('x-document-type') documentType: string,
    @Headers('content-type') contentType: string,
    @Body() buffer: Buffer,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.saveFileAndUpdateDocument(id, {
      name: fileName,
      type: contentType,
      buffer: buffer,
      documentType: documentType,
      userId: user?.userId ?? '',
      tenantId: user?.tenantId ?? '',
    });
  }
}
