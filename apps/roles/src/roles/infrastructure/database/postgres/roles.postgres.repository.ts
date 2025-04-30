import { Injectable } from '@nestjs/common';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RolesRepository } from '../../../domain/repository/roles.repository';
import { Role } from './entities/role.entity';
import { CreateRole } from '../../../domain/repository/types/create-role';
import { FindAllRolesFilter } from '../../../domain/repository/types/find-all-roles-filter';
import { UpdateRole } from '../../../domain/repository/types/update-role';
import { RoleTree } from '../../../domain/repository/types/role-tree';

@Injectable()
export class RolesPostgresRepository implements RolesRepository {
  constructor(private readonly roleRepository: Repository<Role>) {}

  async createRole(createRole: CreateRole): Promise<Role> {
    return this.roleRepository.save(plainToInstance(Role, createRole));
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

    // Копируем и подготовим элементы
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
    console.log({ id, ...updateRole });
    return this.roleRepository.save(
      plainToInstance(Role, { id, ...updateRole }),
    );
  }
}
