import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CheckFileInfoHeaders {
  /**
   * Session context if it is provided on the initial WOPI action URL.
   * */
  @IsString()
  @IsOptional()
  @Expose({ name: 'x-wopi-sessioncontext' })
  SessionContext?: string;
}
