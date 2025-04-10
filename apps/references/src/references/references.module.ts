import { Module } from '@nestjs/common';
import { ReferencesService } from './application/references.service';
import { ReferencesController } from './interface/http/references.controller';
import { GrpcReferencesController } from './interface/grpc/grpc.references.controller';
import { RmqReferencesController } from './interface/rmq/rmq.references.controller';
import { DatabaseModule } from '../database/database.module';
import { referencesRepository } from './references.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ReferencesController,
    GrpcReferencesController,
    RmqReferencesController,
  ],
  providers: [referencesRepository, ReferencesService],
})
export class ReferencesModule {}
