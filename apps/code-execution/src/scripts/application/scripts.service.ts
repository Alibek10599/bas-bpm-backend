import { Inject, Injectable } from '@nestjs/common';
import { ScriptRepository } from '../domain/repository/script.repository';
import { CreateScript } from '../domain/repository/types/create-script';
import { UpdateScript } from '../domain/repository/types/update-script';
import { FindAllScriptsFilter } from '../domain/repository/types/find-all-scripts-filter';
import { ScriptsRepositoryToken } from '../domain/repository/script.repository.token';

@Injectable()
export class ScriptsService {
  constructor(
    @Inject(ScriptsRepositoryToken)
    private readonly scriptRepository: ScriptRepository,
  ) {}

  async create(createScript: CreateScript) {
    return this.scriptRepository.create(createScript);
  }

  async findAll(findAllScriptsFilter: FindAllScriptsFilter) {
    return this.scriptRepository.findAll(findAllScriptsFilter);
  }

  async findOne(id: string) {
    const result = await this.scriptRepository.findOneById(id);
    if (!result) {
      throw Error('Script not found');
    }
    return result;
  }

  async update(id: string, updateScript: UpdateScript) {
    return this.scriptRepository.update(id, updateScript);
  }
}
