import { TokenPayloadUserTypes } from './token-payload-user-types.enum';

export class TokenPayload {
  type: TokenPayloadUserTypes;
  userId: number;
  tenantId?: string;
  tokenId?: string;
  email?: string;
}
