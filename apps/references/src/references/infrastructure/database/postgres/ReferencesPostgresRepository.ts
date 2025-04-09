import { ReferencesRepository } from '../../../domain/repository/references.repository';
import { Injectable } from '@nestjs/common';
import { Reference } from './entities/reference.entity';
import { Repository } from 'typeorm';
import { CreateReference } from '../../../domain/repository/types/create-reference';
import { UpdateReference } from '../../../domain/repository/types/update-reference';

@Injectable()
export class ReferencesPostgresRepository implements ReferencesRepository {
  constructor(private readonly referenceRepository: Repository<Reference>) {}
  findOneById(id: string): Promise<Reference> {
    return this.referenceRepository.findOne({
      relations: ['referenceData'],
      where: { id },
    });
  }

  create(data: CreateReference): Promise<Reference> {
    return this.referenceRepository.save(data);
  }

  findAll(tenantId: string): Promise<Reference[]> {
    return this.referenceRepository.find({
      where: { tenant_id: tenantId },
    });
  }

  update(id: string, updateReference: UpdateReference): Promise<Reference> {
    return this.referenceRepository.save({ id, ...updateReference });
  }
}
