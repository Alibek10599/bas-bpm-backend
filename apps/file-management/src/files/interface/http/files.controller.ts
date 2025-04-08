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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  create(
    @Headers('x-file-name') fileName: string,
    @Headers('content-type') contentType: string,
    @Body() buffer: Buffer,
  ) {
    return this.filesService.create({
      name: fileName,
      type: contentType,
      buffer: buffer,
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
