import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FilesService } from '../../files/application/files.service';
import { DOCUMENT_REPOSITORY_TOKEN } from '../domain/repository/document.repository.token';
import { DocumentRepository } from '../domain/repository/document.repository';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { Document } from '../infrastructure/database/postgres/entities/document.entity';
import { DocumentPermissionsEnum } from '../infrastructure/enums/document-permissions.enum';
import { DocumentVersions } from '../infrastructure/database/postgres/entities/document-versions.entity';
import { CreateDocument } from '../domain/repository/types/create-document';
import { UpdateDocument } from '../domain/repository/types/update-document';
import { File } from '../../files/infrastructure/database/postgres/entities/file.entity';
import { CreateEmptyDocument } from '../domain/repository/types/create-empty-document';
import { CreateEmptyDocumentResponse } from '../domain/repository/types/create-empty-document.response';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly filesService: FilesService,
    @Inject(DOCUMENT_REPOSITORY_TOKEN)
    private readonly documentsRepository: DocumentRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async saveFileAndCreateDocument(createDocumentDto: CreateDocument) {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const versionRepo = em.getRepository(DocumentVersions);
      const { fileId } = await this.filesService.saveFileInTransaction(
        createDocumentDto,
        em,
      );
      const document = await documentRepo.save({
        name: createDocumentDto.name,
        documentType: createDocumentDto.documentType,
        size: createDocumentDto.buffer.length,
        createdBy: createDocumentDto.userId,
        tenantId: createDocumentDto.tenantId,
        documentPermissions: [
          {
            userId: createDocumentDto.userId,
            permissionType: DocumentPermissionsEnum.delete,
          },
        ],
      });
      const version = await versionRepo.save({
        createdBy: createDocumentDto.userId,
        file: { id: fileId },
        document: document,
      });
      await documentRepo.save({ id: document.id, currentVersion: version });

      return {
        documentId: document.id,
        message: 'Document successfully uploaded',
      };
    });
  }

  async createEmptyDocument(
    createEmptyDocument: CreateEmptyDocument,
  ): Promise<CreateEmptyDocumentResponse> {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const versionRepo = em.getRepository(DocumentVersions);

      const { fileId } = await this.filesService.createEmptyFileInTransaction(
        em,
        {
          name: createEmptyDocument.name,
          type: createEmptyDocument.documentType,
          userId: createEmptyDocument.userId,
          tenantId: createEmptyDocument.tenantId,
        },
      );

      const document = await documentRepo.save({
        name: createEmptyDocument.name,
        documentType: createEmptyDocument.documentType,
        createdBy: createEmptyDocument.userId,
        tenantId: createEmptyDocument.tenantId,
        documentPermissions: [
          {
            userId: createEmptyDocument.userId,
            permissionType: DocumentPermissionsEnum.delete,
          },
        ],
      });
      const version = await versionRepo.save({
        createdBy: createEmptyDocument.userId,
        document: document,
        file: { id: fileId },
      });
      await documentRepo.save({ id: document.id, currentVersion: version });

      return {
        fileId: document.id,
        message: 'Document successfully created',
      };
    });
  }

  async createDocument(
    createDocumentDto: Omit<CreateDocument, 'buffer'> & {
      size: number;
      hashName: string;
    },
  ) {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const versionRepo = em.getRepository(DocumentVersions);
      const file = await em.getRepository(File).save({
        name: createDocumentDto.name,
        hashName: createDocumentDto.hashName,
        size: createDocumentDto.size,
        type: createDocumentDto.type,
        userId: createDocumentDto.userId,
        tenantId: createDocumentDto.tenantId,
      });
      const document = await documentRepo.save({
        name: createDocumentDto.name,
        documentType: createDocumentDto.documentType,
        createdBy: createDocumentDto.userId,
        tenantId: createDocumentDto.tenantId,
        documentPermissions: [
          {
            userId: createDocumentDto.userId,
            permissionType: DocumentPermissionsEnum.delete,
          },
        ],
      });
      const version = await versionRepo.save({
        createdBy: createDocumentDto.userId,
        file: file,
        document: document,
      });
      await documentRepo.save({ id: document.id, currentVersion: version });

      return {
        documentId: document.id,
        message: 'Document successfully uploaded',
      };
    });
  }

  findAll() {
    return this.documentsRepository.findAll({});
  }

  async findOne(id: string) {
    const doc = await this.documentsRepository.findOneById(id);

    if (!doc) {
      throw new Error('Document not found');
    }
    return doc;
  }

  findDocumentVersionsById(id: string) {
    return this.documentsRepository.findDocumentVersionsById(id);
  }

  changeDocumentVersion(id: string, versionId: string) {
    return this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const documentVersionRepo = em.getRepository(DocumentVersions);
      const document = await documentRepo.findOne({
        relations: ['currentVersion'],
        where: { id },
      });

      if (!document) {
        throw new HttpException('Document not found', 404);
      }

      const version = await documentVersionRepo.findOne({
        where: { id: versionId, document: { id } },
      });

      if (!version) {
        throw new HttpException('Version not found', 404);
      }

      document.currentVersion = version;
      await documentRepo.save(document);
      return {
        documentId: document.id,
        versionId: version.id,
        message: 'Document version changed successfully',
      };
    });
  }

  async findOneContent(id: string, version: number) {
    const document = await this.documentsRepository.findOneById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    if (!document.currentVersion.file) {
      throw new Error('File not found');
    }

    if (version || version === 0) {
      const docVersion = await this.dataSource
        .getRepository(DocumentVersions)
        .findOne({ relations: ['file'], where: { document: { id }, version } });
      return await this.filesService.findOneContent(docVersion.file.id);
    }

    return await this.filesService.findOneContent(
      document.currentVersion.file.id,
    );
  }

  async saveFileAndUpdateDocument(
    id: string,
    updateDocumentDto: UpdateDocument,
  ) {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const documentVersionRepo = em.getRepository(DocumentVersions);
      const document = await documentRepo.findOne({
        relations: ['currentVersion'],
        where: { id },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      const { fileId } = await this.filesService.saveFileInTransaction(
        updateDocumentDto,
        em,
      );

      document.currentVersion = await documentVersionRepo.save({
        createdBy: updateDocumentDto.userId,
        file: {
          id: fileId,
        },
        document: document,
        version: document.currentVersion.version + 1,
      });

      await documentRepo.save(document);
      return {
        documentId: document.id,
        versionId: document.currentVersion.id,
        message: 'Document updated successfully',
      };
    });
  }

  async updateDocument(
    id: string,
    updateDocumentDto: Omit<UpdateDocument, 'buffer'> & {
      size: number;
      hashName: string;
    },
  ) {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const documentVersionRepo = em.getRepository(DocumentVersions);
      const document = await documentRepo.findOne({
        relations: ['currentVersion'],
        where: { id },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      const file = await em.getRepository(File).save({
        name: updateDocumentDto.name,
        hashName: updateDocumentDto.hashName,
        size: updateDocumentDto.size,
        type: updateDocumentDto.type,
        userId: updateDocumentDto.userId,
        tenantId: updateDocumentDto.tenantId,
      });

      document.currentVersion = await documentVersionRepo.save({
        createdBy: updateDocumentDto.userId,
        file: {
          id: file.id,
        },
        document: document,
        version: document.currentVersion.version + 1,
      });

      await documentRepo.save(document);

      return {
        documentId: document.id,
        versionId: document.currentVersion.id,
        message: 'Document updated successfully',
      };
    });
  }
}
