import { Injectable } from '@nestjs/common';
import { ApiTokensRepository } from '../../../domain/repository/api-tokens.repository';
import { CreateApiToken } from '../../../domain/repository/types/create-api-token';
import { ApiToken } from './entities/api-token.entity';
import { FindAllApiTokensFilter } from '../../../domain/repository/types/find-all-api-tokens-filter';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { UpdateApiToken } from '../../../domain/repository/types/update-api-token';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApiTokensPostgresRepository implements ApiTokensRepository {
  constructor(
    @InjectRepository(ApiToken)
    private readonly apiTokenRepository: Repository<ApiToken>,
  ) {}
  createApiToken(createApiToken: CreateApiToken): Promise<ApiToken> {
    return this.apiTokenRepository.save(createApiToken);
  }

  findAll(filter?: FindAllApiTokensFilter): Promise<ApiToken[]> {
    return this.apiTokenRepository.find({
      where: { name: filter?.search ? ILike(`%${filter.search}%`) : undefined },
    });
  }

  async findAllPaginated(
    filter: FindAllApiTokensFilter,
  ): Promise<PaginatedList<ApiToken>> {
    const result = await this.apiTokenRepository.findAndCount({
      where: {
        name: filter?.search ? ILike(`%${filter.search}%`) : undefined,
      },
    });
    return toPaginated(...result);
  }

  findOneById(id: string): Promise<ApiToken> {
    return this.apiTokenRepository.findOneBy({ id });
  }

  findOneByToken(token: string): Promise<ApiToken> {
    return this.apiTokenRepository.findOneBy({ token });
  }

  updateApiToken(
    id: string,
    updateApiToken: UpdateApiToken,
  ): Promise<ApiToken> {
    return this.apiTokenRepository.save({ id, ...updateApiToken });
  }

  async deleteApiToken(id: string): Promise<'OK'> {
    await this.apiTokenRepository.delete({ id });
    return 'OK';
  }
}
