import { IsBooleanString, IsIn, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PutFileHeaders {
  /**
   * The requested operation from the WOPI server (PUT).
   */
  @IsIn(['PUT'])
  @Expose({ name: 'x-wopi-override' })
  operation: string;

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-wopi-lock' })
  lockId?: string;

  /**
   * All the users who contributed changes to the document in this PutFile request (UserId values delimited by commas).
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-wopi-editors' })
  editors?: string;

  /**
   * Indicates whether the user has modified the document before the save ("true"), or if they just pressed the Save button without any modification ("false").
   * */
  @IsOptional()
  @IsBooleanString()
  @Expose({ name: 'x-lool-wopi-ismodifiedbyuser' })
  isModifiedByUser?: string;

  /**
   * Indicates whether the PutFile is triggered by autosave ("true") or by explicit user operation (Save button or menu entry) ("false").
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-lool-wopi-isautosave' })
  isAutosave?: string;

  /**
   * Indicates whether an automatic save will be triggered when the document gets cleaned up from memory (e.g. when all users disconnect) ("true") or not ("false").
   * */
  @IsOptional()
  @IsString()
  @Expose({ name: 'x-lool-wopi-isexitsave' })
  isExitSave?: string;
}
