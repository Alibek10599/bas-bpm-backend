import { IsIn, IsOptional, IsString } from 'class-validator';

export class LockFileHeader {
  /**
   * The requested operation from the WOPI server (LOCK/UNLOCK/REFRESH_LOCK).
   * */
  @IsIn(['LOCK', 'UNLOCK', 'REFRESH_LOCK'])
  'X-WOPI-Override': 'LOCK' | 'UNLOCK' | 'REFRESH_LOCK';
  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsOptional()
  @IsString()
  'X-WOPI-Lock': string;
}
