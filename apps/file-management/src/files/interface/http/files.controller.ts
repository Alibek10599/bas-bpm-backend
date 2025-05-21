import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from '../../application/files.service';
import { Response } from 'express';
import { AccessGuard, CurrentUser } from '@app/common';
import { CreateEmptyFileDto } from '../dto/create-empty-file.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard, AccessGuard(['files.file.upload']))
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

  @UseGuards(AuthGuard, AccessGuard(['files.file.createEmpty']))
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

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.filesService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @UseGuards(AuthGuard, AccessGuard(['files.file.getContent']))
  @Get(':id/content')
  async findOneContent(@Res() res: Response, @Param('id') id: string) {
    const file = await this.filesService.findOneContent(id);
    res.header('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(file.buffer);
  }
}
