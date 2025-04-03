import { Module } from '@nestjs/common';
import { DocumentsService } from './application/documents.service';
import { DocumentsController } from './interface/http/documents.controller';
import { GrpcDocumentsController } from './interface/grpc/grpc.documents.controller';
import { RmqDocumentsController } from './interface/rmq/rmq.documents.controller';
import { DatabaseModule } from '../../../tasks/src/database/database.module';
import { documentsRepository } from './documents.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [
    DocumentsController,
    RmqDocumentsController,
    GrpcDocumentsController,
  ],
  providers: [documentsRepository, DocumentsService],
})
export class DocumentsModule {}
