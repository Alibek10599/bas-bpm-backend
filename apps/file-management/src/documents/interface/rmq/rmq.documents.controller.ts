import { Controller } from '@nestjs/common';
import { DocumentsService } from '../../application/documents.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { RequestMetadata } from '../dto/request.metadata';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { ChangeDocumentVersionDto } from '../dto/change-document-version.dto';

@Controller('documents')
export class RmqDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @MessagePattern('documents.create')
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

  @MessagePattern('documents.update')
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

  @MessagePattern('documents.findAll')
  findAllDocuments() {
    return this.documentsService.findAll();
  }

  @MessagePattern('documents.findOne')
  findOneDocument(@Payload('body') data: { documentId: string }) {
    return this.documentsService.findOne(data.documentId);
  }

  @MessagePattern('documents.versions')
  findDocumentVersions(@Payload('body') data: { documentId: string }) {
    return this.documentsService.findDocumentVersionsById(data.documentId);
  }

  @MessagePattern('documents.change-version')
  changeDocumentVersion(
    @Payload('body') data: { documentId: string } & ChangeDocumentVersionDto,
  ) {
    return this.documentsService.changeDocumentVersion(
      data.documentId,
      data.versionId,
    );
  }
}
