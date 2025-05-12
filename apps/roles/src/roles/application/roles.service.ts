import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../domain/repository/roles.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repository/roles.repository.token';
import { CreateRole } from '../domain/repository/types/create-role';
import { UpdateRole } from '../domain/repository/types/update-role';
import { Role } from '../infrastructure/database/postgres/entities/role.entity';
import { RoleTree } from '../domain/repository/types/role-tree';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly rolesRepository: RolesRepository,
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

  async update(id: string, updateRoleDto: UpdateRole) {
    const createdRole = await this.rolesRepository.updateRole(
      id,
      updateRoleDto,
    );
    return {
      message: 'Role successfully updated',
      roleId: createdRole.id,
    };
  }
}
