import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DocumentsService } from './application/documents.service';
import { DocumentsController } from './interface/http/documents.controller';
import { GrpcDocumentsController } from './interface/grpc/grpc.documents.controller';
import { RmqDocumentsController } from './interface/rmq/rmq.documents.controller';
import { documentsRepository } from './documents.repository';
import { FilesModule } from '../files/files.module';
import { rawBodyMiddleware } from '../files/interface/http/middlewares/raw.body.middleware';
import { DatabaseModule } from '../database/database.module';
import { RouteInfo } from '@nestjs/common/interfaces';

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [
    DocumentsController,
    RmqDocumentsController,
    GrpcDocumentsController,
  ],
  providers: [documentsRepository, DocumentsService],
})
export class DocumentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rawBodyMiddleware)
      .forRoutes(
        { path: 'documents/upload', method: RequestMethod.POST },
        { path: 'documents/:id', method: RequestMethod.PUT },
      );
  }
}
