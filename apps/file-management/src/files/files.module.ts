import { Module } from '@nestjs/common';
import { FilesService } from './application/files.service';
import { FilesController } from './interface/http/files.controller';
import { RmqFilesController } from './interface/rmq/rmq.files.controller';
import { GrpcFilesController } from './interface/grpc/grpc.files.controller';
import { DatabaseModule } from '../../../tasks/src/database/database.module';
import { filesRepository } from './files.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController, RmqFilesController, GrpcFilesController],
  providers: [filesRepository, FilesService],
})
export class FilesModule {}
