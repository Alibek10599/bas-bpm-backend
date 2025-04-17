import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { File } from './entities/file.entity';
import { CreateFile } from '../../../domain/repository/types/create-file';
import { FindAllFilesFilter } from '../../../domain/repository/types/find-all-files-filter';
import { FilesRepository } from '../../../domain/repository/files.repository';

@Injectable()
export class FilesPostgresRepository implements FilesRepository {
  constructor(private readonly fileRepository: Repository<File>) {}

  async createFile(createFile: CreateFile): Promise<File> {
    return this.fileRepository.save(plainToInstance(File, createFile));
  }

  async findAll(filter: FindAllFilesFilter): Promise<File[]> {
    return this.fileRepository.find();
  }

  async findAllPaginated(
    filter: FindAllFilesFilter,
  ): Promise<PaginatedList<File>> {
    return this.fileRepository
      .findAndCount()
      .then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<File> {
    return this.fileRepository.findOneBy({ id });
  }
}
