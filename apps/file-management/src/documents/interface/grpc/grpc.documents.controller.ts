import { Controller } from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '../dto/request.metadata';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';

@Controller('documents')
export class GrpcDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @GrpcMethod('DocumentsService', 'CreateDocument')
  createDocument(
    @Payload('body')
    data: Omit<CreateDocumentDto, 'buffer'> & {
      size: number;
      hashName: string;
    },
    @Payload('metadata') metadata: RequestMetadata,
  ) {
    return this.documentsService.createDocument({
      ...data,
      ...metadata,
    });
  }

  @GrpcMethod('DocumentsService', 'UpdateDocument')
  updateDocument(
    @Payload('body')
    data: Omit<UpdateDocumentDto, 'buffer'> & {
      size: number;
      hashName: string;
    },
    @Payload('metadata') metadata: RequestMetadata,
  ) {
    return this.documentsService.updateDocument(data.documentId, {
      ...data,
      ...metadata,
    });
  }

  @GrpcMethod('DocumentsService', 'FindAllDocuments')
  findAllDocuments() {
    return this.documentsService.findAll();
  }

  @GrpcMethod('DocumentsService', 'FindOneDocument')
  findOneDocument(@Payload('body') data: { documentId: string }) {
    return this.documentsService.findOne(data.documentId);
  }

  @GrpcMethod('DocumentsService', 'FindAllDocumentVersions')
  findDocumentVersions(@Payload('body') data: { documentId: string }) {
    return this.documentsService.findDocumentVersionsById(data.documentId);
  }

  @GrpcMethod('DocumentsService', 'ChangeDocumentVersion')
  changeDocumentVersion(
    @Payload('body') data: { documentId: string } & ChangeDocumentVersionDto,
  ) {
    return this.documentsService.changeDocumentVersion(
      data.documentId,
      data.versionId,
    );
  }
}
