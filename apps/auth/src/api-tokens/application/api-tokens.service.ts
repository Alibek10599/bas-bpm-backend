import { Inject, Injectable } from '@nestjs/common';
import { ApiTokensRepository } from '../domain/repository/api-tokens.repository';
import { API_TOKENS_REPOSITORY } from '../domain/repository/api-tokens.repository.token';
import { CreateApiToken } from './types/create-api-token';
import { UpdateApiToken } from '../domain/repository/types/update-api-token';
import { FindAllApiTokensFilter } from '../domain/repository/types/find-all-api-tokens-filter';

@Injectable()
export class ApiTokensService {
  constructor(
    @Inject(API_TOKENS_REPOSITORY)
    private readonly apiTokensRepository: ApiTokensRepository,
  ) {}

  async create(createApiTokenDto: CreateApiToken) {
    const token = this.generateToken();
    const result = await this.apiTokensRepository.createApiToken({
      ...createApiTokenDto,
      token,
    });
    return {
      apiTokenId: result.id,
      token,
      message: 'Api token created successfully',
    };
  }

  findAll(filter?: FindAllApiTokensFilter) {
    return this.apiTokensRepository.findAll(filter);
  }

  findOne(id: string) {
    return this.apiTokensRepository.findOneById(id);
  }

  findOneByToken(token: string) {
    return this.apiTokensRepository.findOneByToken(token);
  }

  async update(id: string, updateApiTokenDto: UpdateApiToken) {
    await this.apiTokensRepository.updateApiToken(id, updateApiTokenDto);
    return {
      apiTokenId: id,
      message: 'Api token updated successfully',
    };
  }

  async remove(id: string) {
    await this.apiTokensRepository.deleteApiToken(id);
    return {
      apiTokenId: id,
      message: 'Api token removed successfully',
    };
  }

  private generateToken() {
    // можно зашифровать tenantId expirationDate и accessType, mb так tenantId|expirationDate|accessType
    return crypto.randomUUID();
  }
}
