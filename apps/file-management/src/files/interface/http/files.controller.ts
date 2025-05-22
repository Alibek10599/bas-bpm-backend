import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Res,
} from '@nestjs/common';
import { FilesService } from '../../application/files.service';
import { Response } from 'express';
import { CurrentUser } from '@app/common';
import { CreateEmptyFileDto } from '../dto/create-empty-file.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { CreateFileDto } from '../dto/create-file.dto';

@ApiTags('Files')
@ApiBearerAuth('JWT')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('application/octet-stream')
  @ApiHeader({
    name: 'x-file-name',
    description: 'Name of the file to upload',
    required: true,
  })
  @ApiHeader({
    name: 'content-type',
    description: 'MIME type of the file',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: CreateFileDto,
  })
  @ApiBody({
    description: 'Binary file content',
  })
  @Post('upload')
  upload(
    @Headers('x-file-name') fileName: string,
    @Headers('content-type') contentType: string,
    @Body() buffer: Buffer,
    @CurrentUser() user: any,
  ) {
    return this.filesService.saveFile({
      name: fileName,
      type: contentType,
      buffer: buffer,
      userId: user.userId,
      tenantId: user.tenantId,
      documentType: contentType.split('/')[1] || 'unknown',
    });
  }

  @ApiOperation({ summary: 'Create an empty file' })
  @ApiResponse({
    status: 201,
    description: 'Empty file created successfully',
  })
  @Post('create-empty')
  createEmpty(
    @Body() createEmptyFileDto: CreateEmptyFileDto,
    @CurrentUser() user: any,
  ) {
    return this.filesService.createEmptyFile({
      ...createEmptyFileDto,
      userId: user?.userId ?? '',
      tenantId: user?.tenantId ?? '',
    });
  }

  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all files',
    type: [CreateFileDto],
  })
  @Get()
  findAll() {
    return this.filesService.findAll({});
  }

  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the file metadata',
    type: CreateFileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @ApiOperation({ summary: 'Get file content by ID' })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the file content as a stream',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @Get(':id/content')
  async findOneContent(@Res() res: Response, @Param('id') id: string) {
    const file = await this.filesService.findOneContent(id);
    res.header('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(file.buffer);
  }
}
