import {
  FileProvider,
  PutFileOptions,
  File,
} from '@app/common/api/only-office';

export class TestFileProvider implements FileProvider {
  async getFileById(fileId: string): Promise<File | null> {
    return {
      id: fileId,
      name: 'bro',
      size: 1024,
      version: '1',
      lockId: '123',
      lockedAt: new Date(),
    };
  }

  async getFileWithContentById(
    fileId: string,
  ): Promise<File & { buffer: Buffer }> {
    return {
      id: fileId,
      name: 'bro',
      size: 1024,
      version: '1',
      lockId: '123',
      lockedAt: new Date(),
      buffer: Buffer.from('Hi there!', 'utf-8'),
    };
  }

  async lockFile(fileId: string): Promise<string> {
    console.log(`lockFile ${fileId}`);
    return '123';
  }

  async putFile(options: PutFileOptions): Promise<File> {
    console.log('putFile');
    return {
      id: '123',
      name: options.name,
      size: 1024,
      relatedTo: options.relatedTo,
      version: '1',
      lockId: '123',
      lockedAt: new Date(),
    };
  }

  async refreshLockFile(fileId: string): Promise<void> {
    console.log(`refreshLockFile ${fileId}`);
  }

  async renameFile(fileId: string, newName: string): Promise<void> {
    console.log(`renameFile ${fileId}, ${newName}`);
  }

  async unlockFile(fileId: string): Promise<void> {
    console.log('unlockFile');
  }

  async updateFileContent(fileId: string, buffer: Buffer): Promise<File> {
    return {
      id: fileId,
      name: 'file.gg',
      size: 1024,
      version: '1',
      lockId: '123',
      lockedAt: new Date(),
    };
  }
}
