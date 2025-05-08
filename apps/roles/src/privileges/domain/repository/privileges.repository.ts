import { PaginatedList } from '@app/common/pagination';
import { Privilege } from '../../infrastructure/database/postgres/entities/privilege.entity';
import { CreatePrivilege } from './types/create-privilege';
import { UpdatePrivilege } from './types/update-privilege';
import { FindAllPrivilegesFilter } from './types/find-all-privileges-filter';

export interface PrivilegesRepository {
  findOneById(id: string): Promise<Privilege>;
  findAll(filter?: FindAllPrivilegesFilter): Promise<Privilege[]>;
  findAllPaginated(
    filter: FindAllPrivilegesFilter,
  ): Promise<PaginatedList<Privilege>>;
  createPrivilege(createPrivilege: CreatePrivilege): Promise<Privilege>;
  updatePrivilege(
    id: string,
    updatePrivilege: UpdatePrivilege,
  ): Promise<Privilege>;
}
