import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FilesService } from '../../application/files.service';
import { CreateFileDto } from '../dto/create-file.dto';

@Controller('files')
export class GrpcFilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.saveFile(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }
}
