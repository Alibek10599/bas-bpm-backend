import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from '../interface/dto/create-file.dto';
import { FILES_REPOSITORY_TOKEN } from '../domain/repository/files.repository.token';
import { FilesRepository } from '../domain/repository/files.repository';
import { StorageProvider } from '../infrastructure/storage/storage.provider';
import { STORAGE_PROVIDER_TOKEN } from '../infrastructure/storage/providers/storage.provider.token';
import { FindAllFilesFilter } from '../domain/repository/types/find-all-files-filter';
import { Buffer } from 'buffer';
import { File } from '../infrastructure/database/postgres/entities/file.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILES_REPOSITORY_TOKEN)
    private readonly filesRepository: FilesRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}

  async saveFile(createFileDto: CreateFileDto) {
    const hashName = await this.storageProvider.save({
      name: createFileDto.name,
      buffer: createFileDto.buffer,
    });

    const file = await this.filesRepository.createFile({
      name: createFileDto.name,
      hashName,
      size: createFileDto.buffer.length,
      type: createFileDto.type,
      userId: createFileDto.userId,
      tenantId: createFileDto.tenantId,
    });

    return {
      fileId: file.id,
      message: 'File successfully uploaded',
    };
  }

  async saveFileInTransaction(createFileDto: CreateFileDto, em: EntityManager) {
    const hashName = await this.storageProvider.save({
      name: createFileDto.name,
      buffer: createFileDto.buffer,
    });

    const file = await em.getRepository(File).save({
      name: createFileDto.name,
      hashName,
      size: createFileDto.buffer.length,
      type: createFileDto.type,
      userId: createFileDto.userId,
      tenantId: createFileDto.tenantId,
    });

    return {
      fileId: file.id,
      message: 'File successfully uploaded',
    };
  }

  findAll(filter: FindAllFilesFilter) {
    return this.filesRepository.findAll(filter);
  }

  findOne(id: string) {
    return this.filesRepository.findOneById(id);
  }

  async findOneContent(id: string): Promise<File & { buffer: Buffer }> {
    const file = await this.filesRepository.findOneById(id);
    const buffer = await this.storageProvider.get(file.hashName);
    return {
      ...file,
      buffer,
    };
  }
}
