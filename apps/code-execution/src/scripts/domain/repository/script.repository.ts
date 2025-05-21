import { Script } from '../../infrastructure/database/postgres/entities/script.entity';
import { CreateScript } from './types/create-script';
import { UpdateScript } from './types/update-script';
import { FindAllScriptsFilter } from './types/find-all-scripts-filter';

export interface ScriptRepository {
  findOneById(id: string): Promise<Script>;
  findAll(filter: FindAllScriptsFilter): Promise<Script[]>;
  create(createScript: CreateScript): Promise<Script>;
  update(id: string, updateScript: UpdateScript): Promise<Script>;
}
