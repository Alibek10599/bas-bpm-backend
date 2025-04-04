export class File {
  id: string;
  name: string;
  size: number;
  version: string;
  lockId?: string;
  relatedTo?: string;
  lockedAt?: Date;
}
