import {
  IsBooleanString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PutRelativeFileHeaders {
  /**
   * The requested operation from the WOPI server (PUT_RELATIVE).
   * */
  @IsIn(['PUT_RELATIVE'])
  'X-WOPI-Override': 'PUT_RELATIVE';

  /**
   * A file extension or a full file name, including the file extension in the format of the UTF-7 encoded string.
   * */
  @IsOptional()
  @IsString()
  'X-WOPI-SuggestedTarget': string;

  /**
   * The size of the file in bytes.
   * */
  @IsOptional()
  @IsNumberString()
  'X-WOPI-Size'?: string;

  /**
   * Indicates that the request is being made in the context of binary document conversion.
   * */
  @IsOptional()
  @IsBooleanString()
  'X-WOPI-FileConversion'?: string;
}
