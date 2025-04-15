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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    });
  }

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

  @Get()
  findAll() {
    return this.filesService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get(':id/content')
  async findOneContent(@Res() res: Response, @Param('id') id: string) {
    const file = await this.filesService.findOneContent(id);
    res.header('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(file.buffer);
  }
}
