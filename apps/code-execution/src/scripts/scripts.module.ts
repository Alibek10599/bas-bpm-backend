import { Module } from '@nestjs/common';
import { ScriptsService } from './application/scripts.service';
import { ScriptsController } from './interface/http/scripts.controller';
import { DatabaseModule } from '../database/database.module';
import { ScriptsRepositoryToken } from './domain/repository/script.repository.token';
import { ScriptPostgresRepository } from './infrastructure/database/postgres/script.postgres.repository';
import { DataSource } from 'typeorm';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { Script } from './infrastructure/database/postgres/entities/script.entity';
import { RmqScriptsController } from './interface/rmq/rmq.scripts.controller';
import { GrpcScriptsController } from './interface/grpc/grpc.scripts.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ScriptsController, RmqScriptsController, GrpcScriptsController],
  providers: [
    {
      provide: ScriptsRepositoryToken,
      useFactory: (dataSource: DataSource) => {
        return new ScriptPostgresRepository(dataSource.getRepository(Script));
      },
      inject: [DATABASE_PROVIDER_TOKEN],
    },
    ScriptsService,
  ],
})
export class ScriptsModule {}
