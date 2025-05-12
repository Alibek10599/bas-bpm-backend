import { Inject, Injectable } from '@nestjs/common';
import { PrivilegesRepository } from '../domain/repository/privileges.repository';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../domain/repository/privileges.repository.token';
import { CreatePrivilege } from '../domain/repository/types/create-privilege';
import { UpdatePrivilege } from '../domain/repository/types/update-privilege';

@Injectable()
export class PrivilegesService {
  constructor(
    @Inject(PRIVILEGES_REPOSITORY_TOKEN)
    private readonly privilegesRepository: PrivilegesRepository,
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

  async update(id: string, updatePrivilege: UpdatePrivilege) {
    const createdPrivilege = await this.privilegesRepository.updatePrivilege(
      id,
      updatePrivilege,
    );
    return {
      message: 'Privilege successfully updated',
      privilegeId: createdPrivilege.id,
    };
  }
}
