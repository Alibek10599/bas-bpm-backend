export class TokenPayload {
  type: 'user' | 'api';
  userId: number;
  tenantId?: string;
  tokenId?: string;
  email?: string;
}
