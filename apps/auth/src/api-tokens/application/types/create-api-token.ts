import { AccessesModel } from '@app/common';

export class CreateApiToken {
  name: string;
  actorId: string;
  accesses: AccessesModel;
  expiredAt: string;
  userId: string;
  tenantId: string;
}
