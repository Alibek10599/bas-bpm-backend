import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ReferencesRepository } from '../domain/repository/references.repository';
import { REFERENCES_REPOSITORY_TOKEN } from '../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { Reference } from '../infrastructure/database/postgres/entities/reference.entity';
import { CreateReferenceDto } from '../interface/dto/create-reference.dto';
import { UpdateReferenceDto } from '../interface/dto/update-reference.dto';
import { ReferenceVersions } from '../infrastructure/database/postgres/entities/reference-version.entity';
import { UpdateReferenceResponseDto } from '../interface/dto/update-reference-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReferencesService {
  constructor(
    @Inject(REFERENCES_REPOSITORY_TOKEN)
    private readonly referencesRepository: ReferencesRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createReferenceDto: CreateReferenceDto,
    userId: string,
    tenantId: string,
  ): Promise<Reference> {
    return this.referencesRepository.create({
      ...createReferenceDto,
      user_id: userId,
      tenant_id: tenantId,
    });
  }

  async findOne(id: string): Promise<Reference> {
    const reference = await this.referencesRepository.findOneById(id);
    if (!reference) {
      throw new NotFoundException('Task does not exist');
    }
    return reference;
  }

  async findAll(): Promise<Reference[]> {
    return this.referencesRepository.findAll();
  }

  async update(
    id: string,
    updateReferenceDto: UpdateReferenceDto,
    userId: string,
  ): Promise<UpdateReferenceResponseDto> {
    return await this.dataSource.transaction(
      'REPEATABLE READ',
      async (em: EntityManager) => {
        const referenceRepository = em.getRepository(Reference);
        const referenceVersionsRepository = em.getRepository(ReferenceVersions);

        const reference = await referenceRepository.findOneByOrFail({ id });

        const currentReferenceVersion =
          await referenceVersionsRepository.findOne({
            where: { reference: { id } },
            order: { id: 'desc' },
          });

        const newVersion = (currentReferenceVersion?.version ?? 0) + 1;

        const updatedReference = await referenceRepository.save(
          plainToInstance(Reference, {
            id,
            version: newVersion,
            ...updateReferenceDto,
          }),
        );

        await referenceVersionsRepository.save({
          reference: updatedReference,
          data: this.getReferenceChanges(reference, updateReferenceDto),
          version: newVersion,
          user_id: userId,
        });

        return {
          taskId: reference.id,
          message: 'Task updated successfully',
        };
      },
    );
  }
  private getReferenceChanges(
    reference: Reference,
    updateReferenceDto: UpdateReferenceDto,
  ) {
    const changes = {};
    for (const key in updateReferenceDto) {
      if (
        reference[key] &&
        updateReferenceDto[key] &&
        updateReferenceDto[key] !== reference[key]
      ) {
        changes[key] = {
          old: reference[key],
          new: updateReferenceDto[key],
        };
      }
    }
    return changes;
  }
}
