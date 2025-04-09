import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Document } from './entities/document.entity';
import { DocumentRepository } from '../../../domain/repository/document.repository';
import { CreateDocument } from '../../../domain/repository/types/create-document';
import { FindAllDocumentsFilter } from '../../../domain/repository/types/find-all-documents-filter';
import { UpdateDocument } from '../../../domain/repository/types/update-document';
import { DocumentVersions } from './entities/document-versions.entity';

@Injectable()
export class DocumentsPostgresRepository implements DocumentRepository {
  constructor(private readonly DocumentRepository: Repository<Document>) {}

  async createDocument(createDocument: CreateDocument): Promise<Document> {
    return this.DocumentRepository.save(
      plainToInstance(Document, createDocument),
    );
  }

  async findAll(filter: FindAllDocumentsFilter): Promise<Document[]> {
    return this.DocumentRepository.find({
      relations: ['currentVersion', 'currentVersion.file'],
    });
  }

  async findAllPaginated(
    filter: FindAllDocumentsFilter,
  ): Promise<PaginatedList<Document>> {
    return this.DocumentRepository.findAndCount({
      relations: ['currentVersion', 'currentVersion.file'],
    }).then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<Document> {
    return this.DocumentRepository.findOne({
      relations: ['currentVersion', 'currentVersion.file'],
      where: { id },
    });
  }

  async findDocumentVersionsById(id: string): Promise<DocumentVersions[]> {
    return this.DocumentRepository.findOne({
      relations: ['versions'],
      where: { id },
    }).then((result) => result.versions);
  }

  async updateDocument(
    id: string,
    updateDocument: UpdateDocument,
  ): Promise<Document> {
    return this.DocumentRepository.save(
      plainToInstance(Document, { id, ...updateDocument }),
    );
  }
}
