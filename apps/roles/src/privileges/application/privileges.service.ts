import { Inject, Injectable } from '@nestjs/common';
import { PrivilegesRepository } from '../domain/repository/privileges.repository';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../domain/repository/privileges.repository.token';
import { HttpUpdatePrivilegeDto } from '../interface/http/dto/http-update-privilege.dto';
import { CreatePrivilege } from '../domain/repository/types/create-privilege';
import { UpdatePrivilege } from '../domain/repository/types/update-privilege';

@Injectable()
export class PrivilegesService {
  constructor(
    @Inject(PRIVILEGES_REPOSITORY_TOKEN)
    private readonly privilegesRepository: PrivilegesRepository,
  ) {}

  create(createPrivilegeDto: CreatePrivilege) {
    return this.privilegesRepository.createPrivilege(createPrivilegeDto);
  }

  findAll() {
    return this.privilegesRepository.findAll();
  }

  findOne(id: string) {
    return this.privilegesRepository.findOneById(id);
  }

  update(id: string, updatePrivilege: UpdatePrivilege) {
    return this.privilegesRepository.updatePrivilege(id, updatePrivilege);
  }
}
