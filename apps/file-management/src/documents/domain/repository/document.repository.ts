import { CreateDocument } from './types/create-document';
import { UpdateDocument } from './types/update-document';
import { FindAllDocumentsFilter } from './types/find-all-documents-filter';
import { PaginatedList } from '@app/common/pagination';
import { Document } from '../../infrastructure/database/postgres/entities/document.entity';

export interface DocumentRepository {
  findOneById(id: string): Promise<Document>;
  findAll(filter: FindAllDocumentsFilter): Promise<Document[]>;
  findAllPaginated(
    filter: FindAllDocumentsFilter,
  ): Promise<PaginatedList<Document>>;
  createDocument(createDocument: CreateDocument): Promise<Document>;
  updateDocument(id: string, updateDocument: UpdateDocument): Promise<Document>;
}
