import { AuthenticatedUser } from '@app/common/auth/types/authenticated-user';
import { AuthenticatePayload } from '@app/common/auth/types/authenticate-payload';
import { Observable } from 'rxjs';

export interface AuthGrpc {
  Authenticate(data: AuthenticatePayload): Observable<AuthenticatedUser>;
}
