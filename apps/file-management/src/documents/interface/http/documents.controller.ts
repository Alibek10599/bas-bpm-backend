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
} from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { CurrentUser } from '@app/common';
import { Response } from 'express';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  create(
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

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/versions')
  findDocumentVersionsById(@Param('id') id: string) {
    return this.documentsService.findDocumentVersionsById(id);
  }

  @Patch(':id/versions')
  changeDocumentVersion(
    @Param('id') id: string,
    @Body() { versionId }: ChangeDocumentVersionDto,
  ) {
    return this.documentsService.changeDocumentVersion(id, versionId);
  }

  @Get(':id/content')
  async findOneContent(@Res() res: Response, @Param('id') id: string) {
    const data = await this.documentsService.findOneContent(id);
    res.header('Content-Type', data.type);
    res.send(data.buffer);
  }

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
