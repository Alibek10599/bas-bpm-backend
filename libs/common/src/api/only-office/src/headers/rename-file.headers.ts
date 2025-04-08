import { IsIn, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class RenameFileHeaders {
  /**
   * The requested operation from the WOPI server (RENAME_FILE).
   * */
  @IsIn(['RENAME_FILE'])
  @Expose({ name: 'x-wopi-override' })
  operation: 'RENAME_FILE';

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsString()
  @IsOptional()
  @Expose({ name: 'x-wopi-lock' })
  lockId: string;

  /**
   * A file name, not including the file extension (in the UTF-7 format).
   * */
  @IsString()
  @IsOptional()
  @Expose({ name: 'x-wopi-requestedname' })
  requestedName?: string;
}
