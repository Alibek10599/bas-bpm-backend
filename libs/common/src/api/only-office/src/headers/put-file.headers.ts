import { IsIn, IsOptional, IsString } from 'class-validator';

export class PutFileHeaders {
  /**
   * The requested operation from the WOPI server (PUT).
   */
  @IsIn(['PUT'])
  'X-WOPI-Override': string;

  /**
   * The lock ID that the host must use to identify the lock on the file.
   * */
  @IsOptional()
  @IsString()
  'X-WOPI-Lock'?: string;

  /**
   * All the users who contributed changes to the document in this PutFile request (UserId values delimited by commas).
   * */
  @IsOptional()
  @IsString()
  'X-WOPI-Editors'?: string;

  /**
   * Indicates whether the user has modified the document before the save ("true"), or if they just pressed the Save button without any modification ("false").
   * */
  @IsOptional()
  @IsString()
  'X-LOOL-WOPI-IsModifiedByUser'?: string;

  /**
   * Indicates whether the PutFile is triggered by autosave ("true") or by explicit user operation (Save button or menu entry) ("false").
   * */
  @IsOptional()
  @IsString()
  'X-LOOL-WOPI-IsAutosave'?: string;

  /**
   * Indicates whether an automatic save will be triggered when the document gets cleaned up from memory (e.g. when all users disconnect) ("true") or not ("false").
   * */
  @IsOptional()
  @IsString()
  'X-LOOL-WOPI-IsExitSave'?: string;
}
