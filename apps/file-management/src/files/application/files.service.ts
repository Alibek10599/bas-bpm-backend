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
import { CreateEmptyFileDto } from '../interface/dto/create-empty-file.dto';
import { Packer, Document } from 'docx';

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

  async createEmptyFileInTransaction(
    em: EntityManager,
    createEmptyFileDto: CreateEmptyFileDto,
  ) {
    const buffer = await this.getEmptyFileByType(createEmptyFileDto.type);

    const hashName = await this.storageProvider.save({
      name: createEmptyFileDto.name,
      buffer: buffer,
    });

    const file = await em.getRepository(File).save({
      name: createEmptyFileDto.name,
      hashName,
      size: buffer.length,
      type: createEmptyFileDto.type,
      userId: createEmptyFileDto.userId,
      tenantId: createEmptyFileDto.tenantId,
    });

    return {
      fileId: file.id,
      message: 'File successfully created',
    };
  }

  async createEmptyFile(createEmptyFileDto: CreateEmptyFileDto) {
    const buffer = await this.getEmptyFileByType(createEmptyFileDto.type);

    const hashName = await this.storageProvider.save({
      name: createEmptyFileDto.name,
      buffer: buffer,
    });

    const file = await this.filesRepository.createFile({
      name: createEmptyFileDto.name,
      hashName,
      size: buffer.length,
      type: createEmptyFileDto.type,
      userId: createEmptyFileDto.userId,
      tenantId: createEmptyFileDto.tenantId,
    });

    return {
      fileId: file.id,
      message: 'File successfully created',
    };
  }

  private async getEmptyFileByType(type: 'docx' | 'pptx' | 'xlsx') {
    switch (type) {
      case 'docx':
        return this.getEmptyDocxFile();
      case 'pptx':
        return this.getEmptyPptxFile();
      case 'xlsx':
        return this.getEmptyXlsxFile();
    }
  }

  private async getEmptyDocxFile() {
    const doc = new Document({
      sections: [],
    });

    return await Packer.toBuffer(doc);
  }
  private async getEmptyPptxFile() {
    return Buffer.from(
      'UEsDBBQABgAIAAAAIQB0DOcYVwEAAOQFAAAQAAAAZG9jUHJvcHMvYXBwLnhtbCCiBAIooAAC' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUEsDBBQABgAIAAAA' +
        'IQB0DOcYVwEAAOQFAAAQAAAAZG9jUHJvcHMvY29yZS54bWwg7FlLbtswEL0r8T9g+Y3uhvRJ' +
        'l22T04E0w3XYHgt0GRMXHCL//uNydWRtpDRqU74WIPTmnOec+bz34TlvAYiDgN9ljkU8z8N+' +
        'jc+KLZc+aZeqzxzv7hHzk3EBNxkKXKocQYlL4SkXxHVn4rL+A52vhlMLFrKtI5InOrK8oGHM' +
        'aIoMWMKJPJzOJSg2+iw9J2cJgr2zTBlU6C6UNFci6hcZTgQ1AfEX6oEG+RhEvmKjUvAW0AV0' +
        'FxXpZc1IqY1Gk/7KSLE3pGyUDtrf4qhyFeJYmKLUEsBAhQDFAAGAAgAAAAhAHTM5xhXAQAA5' +
        'AUAABAAAAAAAAAAAAAAAAAAAAAAGRvY1Byb3BzL2FwcC54bWxQSwECFAMUAAUACAAAACEAdA' +
        'znGFcBAADkBQAAEAAAAAAAAAAAAAAAAAAAAAAAZG9jUHJvcHMvY29yZS54bWxQSwUGAAAAAA' +
        'IAAgDEAQAAvAUAAAAA',
      'base64',
    );
  }
  private async getEmptyXlsxFile() {
    return Buffer.from(
      'UEsDBBQABgAIAAAAIQDq3P6aWwEAAJQDAAAQAAAAZG9jUHJvcHMvYXBwLnhtbCCiBAIooAAC' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUEsDBBQABgAIAAAA' +
        'IQDq3P6aWwEAAJQDAAAQAAAAZG9jUHJvcHMvY29yZS54bWwgy07LbtswDL0r+T9gnxM3Di22' +
        'dIpktnL4sYhN0u1txK+jYZEwMNb/vnXc4Mm8jW2UVU8i9L5H37r8weGfaMR+wWyGe+HBDw8h' +
        'Y1XJbyyoBhR8j4axzNvjssu+/+KMA7FHQ1PQdGJI9oq8NWPUH2+T2U/VOTeTq1hQqhRhMNKp' +
        '2vCHIWKqNfMNXPMm1Yo4zVQzKaosR0RSrIouF1EPzP8+gE0pW9yEtctA8XYSmPL4QyO+hZVS' +
        'Yk9Aecq0CTW4xV1emWnLQSwECFAMUAAUACAAAACEA6tz+mlsBAACUAwAAEAAAAAAAAAAAAAAA' +
        'AAAAAABkb2NQcm9wcy9hcHAueG1sUEsBAhQDFAAGAAgAAAAhAOrc/p5bAQAAlAMAAA8AAAAA' +
        'AAAAAAAAAAAAAGRvY1Byb3BzL2NvcmUueG1sUEsFBgAAAAACAAIAMQEAALQFAAAAAA==',
      'base64',
    );
  }
}
