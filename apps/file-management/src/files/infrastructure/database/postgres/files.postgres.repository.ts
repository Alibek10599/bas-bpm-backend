import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { File } from './entities/File.entity';
import { CreateFile } from '../../../domain/repository/types/create-File';
import { FindAllFilesFilter } from '../../../domain/repository/types/find-all-Files-filter';
import { UpdateFile } from '../../../domain/repository/types/update-File';
import { FilesRepository } from '../../../domain/repository/files.repository';

@Injectable()
export class FilesPostgresRepository implements FilesRepository {
  constructor(private readonly FileRepository: Repository<File>) {}

  async createFile(createFile: CreateFile): Promise<File> {
    return this.FileRepository.save(plainToInstance(File, createFile));
  }

  async findAll(filter: FindAllFilesFilter): Promise<File[]> {
    return this.FileRepository.find();
  }

  async findAllPaginated(
    filter: FindAllFilesFilter,
  ): Promise<PaginatedList<File>> {
    return this.FileRepository.findAndCount().then((res) =>
      toPaginated(...res),
    );
  }

  async findOneById(id: string): Promise<File> {
    return this.FileRepository.findOneBy({ id });
  }

  async updateFile(id: string, updateFile: UpdateFile): Promise<File> {
    return this.FileRepository.save(
      plainToInstance(File, { id, ...updateFile }),
    );
  }
}
