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
} from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { CurrentUser } from '@app/common';
import { Response } from 'express';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';
import { CreateEmptyFileDto } from '../dto/create-empty-file.dto';
import { DocumentContentQueryDto } from '../dto/document-content-query.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth('JWT')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Save file and create document' })
  @ApiResponse({
    status: 201,
    description: 'File saved and document created successfully',
  })
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

  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({
    status: 201,
    description: 'Document successfully created',
  })
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

  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all documents',
  })
  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the document',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get document versions by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns document versions',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @Get(':id/versions')
  findDocumentVersionsById(@Param('id') id: string) {
    return this.documentsService.findDocumentVersionsById(id);
  }

  @ApiOperation({ summary: 'Change document version' })
  @ApiResponse({
    status: 200,
    description: 'Document version changed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @Patch(':id/versions')
  changeDocumentVersion(
    @Param('id') id: string,
    @Body() { versionId }: ChangeDocumentVersionDto,
  ) {
    return this.documentsService.changeDocumentVersion(id, versionId);
  }

  @ApiOperation({ summary: 'Get document content' })
  @ApiResponse({
    status: 200,
    description: 'Returns document content',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @Get(':id/content')
  async findOneContent(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: DocumentContentQueryDto,
  ) {
    console.log(query);
    const data = await this.documentsService.findOneContent(id, +query.version);
    res.header('Content-Type', data.type);
    res.send(data.buffer);
  }

  @ApiOperation({ summary: 'Update file and document' })
  @ApiResponse({
    status: 200,
    description: 'File and document updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
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
