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
import { DocumentTypes } from '../../documents/infrastructure/enums/document-types.enum';
import * as ExcelJS from 'exceljs';
import * as pptxgen from 'pptxgenjs';

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
    const buffer = await this.getEmptyFileByDocumentType(
      createEmptyFileDto.type,
    );

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
    const buffer = await this.getEmptyFileByDocumentType(
      createEmptyFileDto.type,
    );

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

  private async getEmptyFileByDocumentType(
    type: DocumentTypes,
  ): Promise<Buffer> {
    switch (type) {
      case DocumentTypes.WORD:
        return this.getEmptyDocxFile();
      case DocumentTypes.PRESENTATION:
        return this.getEmptyPptxFile();
      case DocumentTypes.EXCEL:
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
    const pptx = new (pptxgen as any)();

    pptx.addSlide();

    const uint8Array = (await pptx.write({
      outputType: 'arraybuffer',
    })) as ArrayBuffer;
    return Buffer.from(uint8Array);
  }
  private async getEmptyXlsxFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
