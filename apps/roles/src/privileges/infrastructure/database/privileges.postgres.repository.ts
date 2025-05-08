import { Inject, Injectable } from '@nestjs/common';
import { PrivilegesRepository } from '../../domain/repository/privileges.repository';
import { CreatePrivilege } from '../../domain/repository/types/create-privilege';
import { Privilege } from './postgres/entities/privilege.entity';
import { FindAllPrivilegesFilter } from '../../domain/repository/types/find-all-privileges-filter';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { UpdatePrivilege } from '../../domain/repository/types/update-privilege';
import { ILike, Repository } from 'typeorm';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../../domain/repository/privileges.repository.token';

@Injectable()
export class PrivilegesPostgresRepository implements PrivilegesRepository {
  constructor(
    @Inject(PRIVILEGES_REPOSITORY_TOKEN)
    private readonly privilegeRepository: Repository<Privilege>,
  ) {}

  createPrivilege(createPrivilege: CreatePrivilege): Promise<Privilege> {
    return this.privilegeRepository.save(createPrivilege);
  }

  findAll(filter?: FindAllPrivilegesFilter): Promise<Privilege[]> {
    return this.privilegeRepository.find({
      where: {
        name: filter.search ? ILike(`%${filter.search}%`) : undefined,
      },
    });
  }

  async findAllPaginated(
    filter: FindAllPrivilegesFilter,
  ): Promise<PaginatedList<Privilege>> {
    const r = await this.privilegeRepository.findAndCount({
      where: {
        name: filter.search ? ILike(`%${filter.search}%`) : undefined,
      },
    });
    return toPaginated(...r);
  }

  findOneById(id: string): Promise<Privilege> {
    return this.privilegeRepository.findOneBy({ id });
  }

  updatePrivilege(
    id: string,
    updatePrivilege: UpdatePrivilege,
  ): Promise<Privilege> {
    return this.privilegeRepository.save({ id, ...updatePrivilege });
  }
}
