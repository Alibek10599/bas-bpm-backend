import { File } from './types/file';
import { PutFileOptions } from './types/put-file.options';

export interface FileProvider {
  getFileById(fileId: string): Promise<File | null>;
  getFileWithContentById(fileId: string): Promise<File & { buffer: Buffer }>;
  lockFile(fileId: string): Promise<string>;
  unlockFile(fileId: string): Promise<string>;
  refreshLockFile(fileId: string): Promise<void>;
  renameFile(fileId: string, newName: string): Promise<void>;
  putFile(options: PutFileOptions): Promise<File>;
  updateFileContent(fileId: string, newName: Buffer): Promise<File>;
}
