import { Inject, Injectable } from '@nestjs/common';
import { PrivilegesRepository } from '../domain/repository/privileges.repository';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../domain/repository/privileges.repository.token';
import { CreatePrivilege } from '../domain/repository/types/create-privilege';
import { UpdatePrivilege } from '../domain/repository/types/update-privilege';
import { DATABASE_PROVIDER_TOKEN } from '../../../../roles/src/database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { getObjectChanges } from '@app/common/utils/get-object-changes';
import { PrivilegeVersion } from '../infrastructure/database/postgres/entities/privilege-version.entity';
import { Privilege } from '../infrastructure/database/postgres/entities/privilege.entity';

@Injectable()
export class PrivilegesService {
  constructor(
    @Inject(PRIVILEGES_REPOSITORY_TOKEN)
    private readonly privilegesRepository: PrivilegesRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async create(createPrivilegeDto: CreatePrivilege) {
    const createdPrivilege = await this.privilegesRepository.createPrivilege(
      createPrivilegeDto,
    );
    return {
      message: 'Privilege successfully created',
      privilegeId: createdPrivilege.id,
    };
  }

  async findAll() {
    return this.privilegesRepository.findAll();
  }

  async findOne(id: string) {
    return this.privilegesRepository.findOneById(id);
  }

  async update(userId: string, id: string, updatePrivilege: UpdatePrivilege) {
    return await this.dataSource.transaction(async (em) => {
      const lastVersion = await em.findOne(PrivilegeVersion, {
        where: { privilege: { id } },
        order: {
          createdAt: 'DESC',
        },
      });

      const privilege = await em.findOneBy(Privilege, { id });

      const createdPrivilege: Privilege = await em.save(Privilege, {
        id,
        ...updatePrivilege,
      });

      await em.save(PrivilegeVersion, {
        userId,
        privilege: { id: createdPrivilege.id },
        changes: getObjectChanges(privilege, updatePrivilege),
        version: (lastVersion?.version ?? 0) + 1,
      });

      return {
        message: 'Privilege successfully updated',
        privilegeId: id,
      };
    });
  }
}
