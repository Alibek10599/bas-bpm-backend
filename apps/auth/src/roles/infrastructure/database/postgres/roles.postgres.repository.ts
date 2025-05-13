import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RolesRepository } from '../../../domain/repository/roles.repository';
import { Role } from './entities/role.entity';
import { CreateRole } from '../../../domain/repository/types/create-role';
import { FindAllRolesFilter } from '../../../domain/repository/types/find-all-roles-filter';
import { UpdateRole } from '../../../domain/repository/types/update-role';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesPostgresRepository implements RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createRole(createRole: CreateRole): Promise<Role> {
    return this.dataSource.transaction(async (em) => {
      const result = await em.save(Role, plainToInstance(Role, createRole));
      await this.refreshMaterializedView(em);
      return result;
    });
  }

  async findAll(filter: FindAllRolesFilter): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['parent'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAllPaginated(
    filter: FindAllRolesFilter,
  ): Promise<PaginatedList<Role>> {
    return this.roleRepository
      .findAndCount()
      .then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<Role> {
    return this.roleRepository.findOneBy({ id });
  }

  async updateRole(id: string, updateRole: UpdateRole): Promise<Role> {
    return this.dataSource.transaction(async (em) => {
      const result = await em.save(
        Role,
        plainToInstance(Role, { id, ...updateRole }),
      );
      await this.refreshMaterializedView(em);
      return result;
    });
  }

  private async refreshMaterializedView(em: EntityManager) {
    await em.query(`REFRESH MATERIALIZED VIEW role_hierarchy;`);
  }
}
