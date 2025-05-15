import { ApiTokenAccessType } from '../../domain/enums/api-token-access-type.enum';

export class CreateApiToken {
  name: string;
  accessType: ApiTokenAccessType;
  expiredAt: string;
  userId: string;
  tenantId: string;
}
