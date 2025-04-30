import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../domain/repository/roles.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repository/roles.repository.token';
import { CreateRole } from '../domain/repository/types/create-role';
import { UpdateRole } from '../domain/repository/types/update-role';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly rolesRepository: RolesRepository,
  ) {}

  create(createRoleDto: CreateRole) {
    return this.rolesRepository.createRole(createRoleDto);
  }

  findAll() {
    return this.rolesRepository.findAll({});
  }

  findOne(id: string) {
    return this.rolesRepository.findOneById(id);
  }

  findAllTree() {
    return this.rolesRepository.findAllTree();
  }

  update(id: string, updateRoleDto: UpdateRole) {
    return this.rolesRepository.updateRole(id, updateRoleDto);
  }
}
