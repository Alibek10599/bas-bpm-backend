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

@Injectable()
export class DocumentsService {
  constructor(
    private readonly filesService: FilesService,
    @Inject(DOCUMENT_REPOSITORY_TOKEN)
    private readonly documentsRepository: DocumentRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async create(createDocumentDto: CreateDocument) {
    return await this.dataSource.transaction(async (em) => {
      const documentRepo = em.getRepository(Document);
      const versionRepo = em.getRepository(DocumentVersions);
      const { fileId } = await this.filesService.createInTransaction(
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

  findAll() {
    return this.documentsRepository.findAll({});
  }

  findOne(id: string) {
    return this.documentsRepository.findOneById(id);
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

  async findOneContent(id: string) {
    const document = await this.documentsRepository.findOneById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    if (!document.currentVersion.file) {
      throw new Error('File not found');
    }

    return await this.filesService.findOneContent(
      document.currentVersion.file.id,
    );
  }

  async update(id: string, updateDocumentDto: UpdateDocument) {
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

      const { fileId } = await this.filesService.createInTransaction(
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
    });
  }
}
