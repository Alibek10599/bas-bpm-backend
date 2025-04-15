export class UpdateFileOptions {
  action: 'LOCK' | 'UNLOCK' | 'REFRESH_LOCK' | 'PUT_RELATIVE' | 'RENAME_FILE';
  buffer?: Buffer;
  suggestedTarget?: string;
  fileSize?: number;
  lockId?: string;
  requestedName?: string;
  fileConversion?: boolean;
}
