export class File {
  id: string;
  name: string;
  size: number;
  version: string;
  lockId?: string;
  lockedAt?: string;
}
