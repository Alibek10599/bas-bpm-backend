import { AccessesModel } from '../../../infrastructure/types/accesses-model';

export class CreatePrivilege {
  name: string;
  accesses: AccessesModel;
  userId?: string;
  tenantId?: string;
}
