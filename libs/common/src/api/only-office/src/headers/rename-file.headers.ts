import { IsIn, IsOptional, IsString } from 'class-validator';

export class RenameFileHeaders {
  /**
   * The requested operation from the WOPI server (RENAME_FILE).
   * */
  @IsIn(['RENAME_FILE'])
  'X-WOPI-Override': 'RENAME_FILE';

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsString()
  @IsOptional()
  'X-WOPI-Lock'?: string;

  /**
   * A file name, not including the file extension (in the UTF-7 format).
   * */
  @IsString()
  @IsOptional()
  'X-WOPI-RequestedName'?: string;
}
