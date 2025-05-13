import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../domain/repository/roles.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repository/roles.repository.token';
import { CreateRole } from '../domain/repository/types/create-role';
import { UpdateRole } from '../domain/repository/types/update-role';
import { Role } from '../infrastructure/database/postgres/entities/role.entity';
import { RoleTree } from '../domain/repository/types/role-tree';
import { DATABASE_PROVIDER_TOKEN } from '../../../../roles/src/database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { RoleVersion } from '../infrastructure/database/postgres/entities/role-version.entity';
import { getObjectChanges } from '@app/common/utils/get-object-changes';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly rolesRepository: RolesRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRole) {
    const createdRole = await this.rolesRepository.createRole(createRoleDto);

    return {
      message: 'Role successfully created',
      roleId: createdRole.id,
    };
  }

  findAll() {
    return this.rolesRepository.findAll({});
  }

  findOne(id: string) {
    return this.rolesRepository.findOneById(id);
  }

  async findAllTree(): Promise<RoleTree[]> {
    const roles = await this.rolesRepository.findAll({});
    return this.makeTree(roles);
  }

  private makeTree(flatRoles: Role[]): RoleTree[] {
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

  async update(userId: string, id: string, updateRoleDto: UpdateRole) {
    return await this.dataSource.transaction(async (em) => {
      const lastVersion = await em.findOne(RoleVersion, {
        where: { role: { id } },
        order: {
          createdAt: 'DESC',
        },
      });

      const role = await em.findOneBy(Role, { id });

      const updatedRole: Role = await em.save(Role, {
        id,
        ...updateRoleDto,
        parent: { id: updateRoleDto.parent },
      });

      await em.save(RoleVersion, {
        userId,
        role: { id: updatedRole.id },
        changes: getObjectChanges(
          {
            ...role,
            parent: { id: role.parent } as any,
          },
          {
            ...updateRoleDto,
            parent: { id: updateRoleDto.parent } as any,
          },
        ),
        version: (lastVersion?.version ?? 0) + 1,
      });

      return {
        message: 'Role successfully updated',
        roleId: role.id,
      };
    });
  }
}
