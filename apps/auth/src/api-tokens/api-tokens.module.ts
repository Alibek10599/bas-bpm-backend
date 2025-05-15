import { Module } from '@nestjs/common';
import { ApiTokensService } from './application/api-tokens.service';
import { ApiTokensController } from './interface/http/api-tokens.controller';
import { ApiTokensRmqController } from './interface/rmq/api-tokens.rmq.controller';
import { ApiTokensGrpcController } from './interface/grpc/api-tokens.grpc.controller';
import { ApiTokensPostgresRepository } from './infrastructure/database/postgres/api-tokens.postgres.repository';
import { API_TOKENS_REPOSITORY } from './domain/repository/api-tokens.repository.token';
import { DatabaseModule } from '@app/common';
import { ApiToken } from './infrastructure/database/postgres/entities/api-token.entity';

@Module({
  imports: [DatabaseModule.forFeature([ApiToken])],
  controllers: [
    ApiTokensController,
    ApiTokensRmqController,
    ApiTokensGrpcController,
  ],
  providers: [
    {
      provide: API_TOKENS_REPOSITORY,
      useClass: ApiTokensPostgresRepository,
    },
    ApiTokensService,
  ],
})
export class ApiTokensModule {}
