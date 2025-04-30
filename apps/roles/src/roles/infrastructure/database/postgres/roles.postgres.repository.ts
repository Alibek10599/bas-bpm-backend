import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RolesRepository } from '../../../domain/repository/roles.repository';
import { Role } from './entities/role.entity';
import { CreateRole } from '../../../domain/repository/types/create-role';
import { FindAllRolesFilter } from '../../../domain/repository/types/find-all-roles-filter';
import { UpdateRole } from '../../../domain/repository/types/update-role';
import { RoleTree } from '../../../domain/repository/types/role-tree';

@Injectable()
export class RolesPostgresRepository implements RolesRepository {
  constructor(
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  private async refreshMaterializedView(em: EntityManager) {
    await em.query(`REFRESH MATERIALIZED VIEW role_hierarchy;`);
  }

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

  async findAllTree() {
    const roles = await this.findAll({});
    return this.makeTree(roles);
  }

  private makeTree(flatRoles: Role[]) {
    const map = new Map<string, Role>();

    flatRoles.forEach((role) => {
      map.set(role.id, { ...role, children: [] });
    });

    const roots: RoleTree[] = [];

    for (const role of flatRoles) {
      const current = map.get(role.id);

      if (role.parent && map.has(role.parent.id)) {
        const parent = map.get(role.parent.id);
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(current);
      } else {
        roots.push(current);
      }
    }

    return roots;
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
}
