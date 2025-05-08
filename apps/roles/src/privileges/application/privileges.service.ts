import { Inject, Injectable } from '@nestjs/common';
import { CreatePrivilegeDto } from '../interface/dto/create-privilege.dto';
import { UpdatePrivilegeDto } from '../interface/dto/update-privilege.dto';
import { PrivilegesRepository } from '../domain/repository/privileges.repository';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../domain/repository/privileges.repository.token';

@Injectable()
export class PrivilegesService {
  constructor(
    @Inject(PRIVILEGES_REPOSITORY_TOKEN)
    private readonly privilegesRepository: PrivilegesRepository,
  ) {}

  create(createPrivilegeDto: CreatePrivilegeDto) {
    return this.privilegesRepository.createPrivilege(createPrivilegeDto);
  }

  findAll() {
    return this.privilegesRepository.findAll();
  }

  findOne(id: string) {
    return this.privilegesRepository.findOneById(id);
  }

  update(id: string, updatePrivilegeDto: UpdatePrivilegeDto) {
    return this.privilegesRepository.updatePrivilege(id, updatePrivilegeDto);
  }
}
