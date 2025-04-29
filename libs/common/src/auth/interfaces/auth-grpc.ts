import { AuthenticatedUser } from '@app/common/auth/types/authenticated-user';
import { AuthenticatePayload } from '@app/common/auth/types/authenticate-payload';

export interface AuthGrpc {
  Authenticate(data: AuthenticatePayload): Promise<AuthenticatedUser>;
}
