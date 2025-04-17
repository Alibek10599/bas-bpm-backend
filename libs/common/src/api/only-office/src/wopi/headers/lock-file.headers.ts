import { IsIn, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LockFileHeader {
  /**
   * The requested operation from the WOPI server (LOCK/UNLOCK/REFRESH_LOCK).
   * */
  @IsIn(['LOCK', 'UNLOCK', 'REFRESH_LOCK'])
  @Expose({ name: 'x-wopi-override' })
  operation: 'LOCK' | 'UNLOCK' | 'REFRESH_LOCK';

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-wopi-lock' })
  lockId: string;
}
