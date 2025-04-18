import { ScriptRepository } from '../../../domain/repository/script.repository';
import { CreateScript } from '../../../domain/repository/types/create-script';
import { UpdateScript } from '../../../domain/repository/types/update-script';
import { Script } from './entities/script.entity';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllScriptsFilter } from '../../../domain/repository/types/find-all-scripts-filter';

@Injectable()
export class ScriptPostgresRepository implements ScriptRepository {
  constructor(private readonly scriptRepository: Repository<Script>) {}

  async create(createScript: CreateScript): Promise<Script> {
    return this.scriptRepository.save(createScript);
  }

  async findOneById(id: string): Promise<Script> {
    return this.scriptRepository.findOneBy({ id });
  }

  async update(id: string, updateScript: UpdateScript): Promise<Script> {
    return this.scriptRepository.save({ ...updateScript, id });
  }

  findAll(filter: FindAllScriptsFilter): Promise<Script[]> {
    return this.scriptRepository.find({
      where: {
        name: filter.search ? ILike(`%${filter.search}%`) : undefined,
        tenantId: filter.tenantId,
        userId: filter.userId,
      },
    });
  }
}
