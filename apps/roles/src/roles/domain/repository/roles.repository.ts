import { CreateRole } from './types/create-role';
import { UpdateRole } from './types/update-role';
import { FindAllRolesFilter } from './types/find-all-roles-filter';
import { PaginatedList } from '@app/common/pagination';
import { Role } from '../../infrastructure/database/postgres/entities/role.entity';
import { RoleTree } from './types/role-tree';

export interface RolesRepository {
  findOneById(id: string): Promise<Role>;
  findAll(filter: FindAllRolesFilter): Promise<Role[]>;
  findAllTree(): Promise<any>;
  findAllPaginated(filter: FindAllRolesFilter): Promise<PaginatedList<Role>>;
  createRole(createRole: CreateRole): Promise<Role>;
  updateRole(id: string, updateRole: UpdateRole): Promise<Role>;
}
