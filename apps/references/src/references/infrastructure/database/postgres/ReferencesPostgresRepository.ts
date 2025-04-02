import { ReferencesRepository } from '../../../domain/repository/references.repository';
import { Injectable } from '@nestjs/common';
import { Reference } from './entities/reference.entity';
import { Repository } from 'typeorm';
import { CreateReferenceDto } from '../../../interface/dto/create-reference.dto';
import { UpdateReferenceDto } from '../../../interface/dto/update-reference.dto';

@Injectable()
export class ReferencesPostgresRepository implements ReferencesRepository {
  constructor(private readonly referenceRepository: Repository<Reference>) {}
  findOneById(id: string): Promise<Reference> {
    return this.referenceRepository.findOne({
      relations: ['referenceData'],
      where: { id },
    });
  }

  create(data: CreateReferenceDto): Promise<Reference> {
    return this.referenceRepository.save(data);
  }

  findAll(): Promise<Reference[]> {
    return this.referenceRepository.find();
  }

  update(
    id: string,
    updateReferenceDto: UpdateReferenceDto,
  ): Promise<Reference> {
    return this.referenceRepository.save({ id, ...updateReferenceDto });
  }
}
