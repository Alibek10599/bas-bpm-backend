import { Controller, Post, Body } from '@nestjs/common';
import { FilesService } from '../../application/files.service';
import { CreateFileDto } from '../dto/create-file.dto';

@Controller('files')
export class RmqFilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.saveFile(createFileDto);
  }
}
