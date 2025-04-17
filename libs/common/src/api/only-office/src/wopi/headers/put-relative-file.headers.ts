import {
  IsBooleanString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class PutRelativeFileHeaders {
  /**
   * The requested operation from the WOPI server (PUT_RELATIVE).
   * */
  @IsIn(['PUT_RELATIVE'])
  @Expose({ name: 'x-wopi-override' })
  operation: 'PUT_RELATIVE';

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsString()
  @IsOptional()
  @Expose({ name: 'x-wopi-lock' })
  lockId: string;

  /**
   * A file extension or a full file name, including the file extension in the format of the UTF-7 encoded string.
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-wopi-suggestedtarget' })
  suggestedTarget: string;

  /**
   * The size of the file in bytes.
   * */
  @IsOptional()
  @IsNumberString()
  @Expose({ name: 'x-wopi-size' })
  size?: string;

  /**
   * Indicates that the request is being made in the context of binary document conversion.
   * */
  @IsOptional()
  @IsBooleanString()
  @Expose({ name: 'x-wopi-fileconversion' })
  fileConversion?: string;
}
