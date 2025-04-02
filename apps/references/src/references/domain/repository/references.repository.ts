import { Reference } from '../../infrastructure/database/postgres/entities/reference.entity';
import { CreateReference } from './types/create-reference';
import { UpdateReference } from './types/update-reference';

export interface ReferencesRepository {
  findOneById(id: string): Promise<Reference>;
  findAll(): Promise<Reference[]>;
  create(data: CreateReference): Promise<Reference>;
  update(id: string, updateReferenceDto: UpdateReference): Promise<Reference>;
}
