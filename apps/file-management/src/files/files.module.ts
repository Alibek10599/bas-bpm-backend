import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { FilesService } from './application/files.service';
import { FilesController } from './interface/http/files.controller';
import { RmqFilesController } from './interface/rmq/rmq.files.controller';
import { GrpcFilesController } from './interface/grpc/grpc.files.controller';
import { filesRepositoryFactory } from './files.repository.factory';
import { filesStorageFactory } from './files.storage.factory';
import { rawBodyMiddleware } from './interface/http/middlewares/raw.body.middleware';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController, RmqFilesController, GrpcFilesController],
  providers: [filesStorageFactory, filesRepositoryFactory, FilesService],
  exports: [FilesService],
})
export class FilesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rawBodyMiddleware)
      .forRoutes({ path: 'files/upload', method: RequestMethod.POST });
  }
}
