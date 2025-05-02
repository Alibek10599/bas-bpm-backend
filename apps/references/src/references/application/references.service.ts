import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ReferencesRepository } from '../domain/repository/references.repository';
import { REFERENCES_REPOSITORY_TOKEN } from '../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { Reference } from '../infrastructure/database/postgres/entities/reference.entity';
import { CreateReferenceDto } from '../interface/dto/create-reference.dto';
import { ReferenceVersions } from '../infrastructure/database/postgres/entities/reference-version.entity';
import { plainToInstance } from 'class-transformer';
import { HttpUpdateReferenceDto } from '../interface/http/dto/http-update-reference.dto';
import { CreateReferenceResponseDto } from '../interface/dto/create-reference.response.dto';
import { UpdateReferenceResponseDto } from '../interface/dto/update-reference.response.dto';

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
  ): Promise<CreateReferenceResponseDto> {
    const reference = await this.referencesRepository.create({
      ...createReferenceDto,
      user_id: userId,
      tenant_id: tenantId,
    });
    return {
      referenceId: reference.id,
      message: 'Reference created successfully',
    };
  }

  async findOne(id: string): Promise<Reference> {
    const reference = await this.referencesRepository.findOneById(id);
    if (!reference) {
      throw new NotFoundException('Reference does not exist');
    }
    return reference;
  }

  async findAll(tenantId: string): Promise<Reference[]> {
    return this.referencesRepository.findAll(tenantId);
  }

  async update(
    id: string,
    updateReferenceDto: HttpUpdateReferenceDto,
    userId: string,
  ): Promise<UpdateReferenceResponseDto> {
    return await this.dataSource.transaction(
      'REPEATABLE READ',
      async (em: EntityManager) => {
        const reference = await em.findOneOrFail(Reference, {
          where: { id },
          relations: ['referenceData'],
        });

        const currentReferenceVersion = await em.findOne(ReferenceVersions, {
          where: { reference: { id } },
          order: { id: 'desc' },
        });

        const newVersion = (currentReferenceVersion?.version ?? 0) + 1;

        const updatedReference = await em.save(
          Reference,
          plainToInstance(Reference, {
            id,
            version: newVersion,
            ...updateReferenceDto,
          }),
        );

        await em.save(ReferenceVersions, {
          reference: updatedReference,
          data: this.getReferenceChanges(reference, updateReferenceDto),
          version: newVersion,
          user_id: userId,
        });

        return {
          referenceId: reference.id,
          message: 'Reference updated successfully',
        };
      },
    );
  }
  private getReferenceChanges(
    reference: Reference,
    updateReferenceDto: HttpUpdateReferenceDto,
  ) {
    const changes = {};
    for (const key in updateReferenceDto) {
      if (
        (reference[key] &&
          updateReferenceDto[key] &&
          updateReferenceDto[key] !== reference[key]) ||
        (key === 'referenceData' && updateReferenceDto[key])
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
