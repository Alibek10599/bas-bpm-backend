import { ApiTokenAccessType } from '../../enums/api-token-access-type.enum';

export class CreateApiToken {
  name: string;
  token: string;
  accessType: ApiTokenAccessType;
  expiredAt: string;
  userId: string;
  tenantId: string;
}
