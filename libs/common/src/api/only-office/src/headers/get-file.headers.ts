import { IsOptional, IsString } from 'class-validator';

export class GetFileHeaders {
  /**
   * The upper bound of the expected size of the file being requested. The host should use the maximum value of a 4-byte integer if this value isn't set in the request. If the file requested is larger than this value, the host must respond with a 412 Precondition Failed.
   * */
  @IsString()
  @IsOptional()
  'X-WOPI-MaxExpectedSize'?: number;
}
