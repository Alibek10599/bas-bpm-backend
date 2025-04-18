import { Injectable } from '@nestjs/common';
import { ScriptRepository } from '../domain/repository/script.repository';
import { CreateScript } from '../domain/repository/types/create-script';
import { UpdateScript } from '../domain/repository/types/update-script';
import { FindAllScriptsFilter } from '../domain/repository/types/find-all-scripts-filter';

@Injectable()
export class ScriptsService {
  constructor(private readonly scriptRepository: ScriptRepository) {}

  create(createScript: CreateScript) {
    return this.scriptRepository.create(createScript);
  }

  findAll(findAllScriptsFilter: FindAllScriptsFilter) {
    return this.scriptRepository.findAll(findAllScriptsFilter);
  }

  findOne(id: string) {
    return this.scriptRepository.findOneById(id);
  }

  update(id: string, updateScript: UpdateScript) {
    return this.scriptRepository.update(id, updateScript);
  }
}
