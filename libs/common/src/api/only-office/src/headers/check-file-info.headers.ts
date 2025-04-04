import { IsOptional, IsString } from 'class-validator';

export class CheckFileInfoHeaders {
  /**
   * Session context if it is provided on the initial WOPI action URL.
   * */
  @IsString()
  @IsOptional()
  'X-WOPI-SessionContext'?: string;
}
