import { PaginatedList } from '@app/common/pagination';
import { CreateApiToken } from './types/create-api-token';
import { UpdateApiToken } from './types/update-api-token';
import { FindAllApiTokensFilter } from './types/find-all-api-tokens-filter';
import { ApiToken } from '../../infrastructure/database/postgres/entities/api-token.entity';

export interface ApiTokensRepository {
  findOneById(id: string): Promise<ApiToken>;
  findOneByToken(token: string): Promise<ApiToken>;
  findAll(filter?: FindAllApiTokensFilter): Promise<ApiToken[]>;
  findAllPaginated(
    filter: FindAllApiTokensFilter,
  ): Promise<PaginatedList<ApiToken>>;
  createApiToken(createApiToken: CreateApiToken): Promise<ApiToken>;
  updateApiToken(id: string, updateApiToken: UpdateApiToken): Promise<ApiToken>;
  deleteApiToken(id: string): Promise<'OK'>;
}
