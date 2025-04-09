import { Controller } from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { RequestMetadata } from '../dto/request.metadata';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';
import { DocumentIdDto } from '../dto/document-id.dto';

@Controller('documents')
export class GrpcDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @GrpcMethod('DocumentsService', 'CreateDocument')
  createDocument(
    @Payload('body')
    data: CreateDocumentDto,
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
    data: UpdateDocumentDto,
    @Payload('metadata') metadata: RequestMetadata,
  ) {
    return this.documentsService.updateDocument(data.documentId, {
      ...data,
      ...metadata,
    });
  }

  @GrpcMethod('DocumentsService', 'FindAllDocuments')
  async findAllDocuments() {
    return {
      items: await this.documentsService.findAll(),
    };
  }

  @GrpcMethod('DocumentsService', 'FindOneDocument')
  findOneDocument(@Payload('body') data: DocumentIdDto) {
    return this.documentsService.findOne(data.documentId);
  }

  @GrpcMethod('DocumentsService', 'FindAllDocumentVersions')
  async findDocumentVersions(@Payload('body') data: DocumentIdDto) {
    return {
      items: await this.documentsService.findDocumentVersionsById(
        data.documentId,
      ),
    };
  }

  @GrpcMethod('DocumentsService', 'ChangeDocumentVersion')
  changeDocumentVersion(@Payload('body') data: ChangeDocumentVersionDto) {
    return this.documentsService.changeDocumentVersion(
      data.documentId,
      data.versionId,
    );
  }
}
