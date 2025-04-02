import { Reference } from '../../infrastructure/database/postgres/entities/reference.entity';
import { CreateReferenceDto } from '../../interface/dto/create-reference.dto';
import { UpdateReferenceDto } from '../../interface/dto/update-reference.dto';

export interface ReferencesRepository {
  findOneById(id: string): Promise<Reference>;
  findAll(): Promise<Reference[]>;
  create(data: CreateReferenceDto): Promise<Reference>;
  update(
    id: string,
    updateReferenceDto: UpdateReferenceDto,
  ): Promise<Reference>;
}
