import { Inject, Injectable } from '@nestjs/common';
import { CheckFileResponseDto } from './dto/check-file.response.dto';
import { PutFileOptions } from './types/put-file.options';
import { PutFileResult } from './types/put-file-result';
import { GetFileResult } from './types/get-file.result';
import { UpdateFileOptions } from './types/update-file.options';
import { FileProvider } from './interfaces/file.provider';
import { LockMismatchError } from './errors/lock-mismatch.error';
import { extname } from 'path';
import { LockFileResult } from '@app/common/api/only-office/src/wopi/types/lock-file.result';
import { FILE_PROVIDER_TOKEN } from '@app/common/api/only-office/src/wopi/const/file.provider.token';
import { RenameFileResult } from '@app/common/api/only-office/src/wopi/types/rename-file.result';
import { PutRelativeFileResult } from '@app/common/api/only-office/src/wopi/types/put-relative-file.result';

@Injectable()
export class OnlyOfficeService {
  constructor(
    @Inject(FILE_PROVIDER_TOKEN) private readonly fileProvider: FileProvider,
  ) {}

  async checkFileInfo(fileId: string): Promise<CheckFileResponseDto> {
    const file = await this.fileProvider.getFileById(fileId);
    return {
      BaseFileName: file?.name ?? '',
      Size: file?.size ?? 0,
      Version: file.version ?? '',
    };
  }

  async getFile(fileId: string): Promise<GetFileResult> {
    const file = await this.fileProvider.getFileWithContentById(fileId);
    return { file: file.buffer, version: file.version };
  }

  async putFile(
    fileId: string,
    buffer: Buffer,
    options: PutFileOptions,
    lockId?: string,
  ): Promise<PutFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (file?.lockId && file.lockId !== lockId) {
      throw new LockMismatchError(file.lockId);
    }

    const { version } = await this.fileProvider.updateFileContent(
      fileId,
      buffer,
    );

    return {
      lockId: file.lockId,
      version: version,
    };
  }

  async lockFile(fileId: string, lockId?: string): Promise<LockFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (!file?.lockId) {
      file.lockId = await this.fileProvider.lockFile(fileId);
    }

    if (lockId === file.lockId) {
      await this.fileProvider.refreshLockFile(fileId);
    }

    if (lockId !== file.lockId) {
      throw new LockMismatchError(file.lockId);
    }

    return {
      lockId: file.lockId,
      version: file.version,
    };
  }

  async unlockFile(fileId: string, lockId?: string): Promise<LockFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (!file?.lockId) {
      return {
        lockId: '',
        version: file.version,
      };
    }

    if (file.lockId === lockId) {
      await this.fileProvider.unlockFile(fileId);
    } else {
      throw new LockMismatchError(file.lockId);
    }

    return {
      lockId: file.lockId,
      version: file.version,
    };
  }

  async refreshLock(fileId: string, lockId?: string): Promise<LockFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (!file?.lockId || file.lockId !== lockId) {
      throw new LockMismatchError(file?.lockId ?? '');
    }

    await this.fileProvider.refreshLockFile(fileId);

    return {
      lockId: file.lockId,
      version: file.version,
    };
  }

  async renameFile(
    fileId: string,
    newName: string,
    lockId?: string,
  ): Promise<RenameFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (file?.lockId && lockId !== file.lockId) {
      throw new LockMismatchError(file.lockId);
    }

    await this.fileProvider.renameFile(fileId, newName);

    return {
      lockId: file.lockId,
      newName: newName,
    };
  }

  async putRelativeFile(
    fileId: string,
    buffer: Buffer,
    suggestedTarget: string,
    lockId?: string,
    fileSize?: number,
    fileConversion?: boolean,
  ): Promise<PutRelativeFileResult> {
    const file = await this.fileProvider.getFileById(fileId);

    if (file?.lockId && lockId !== file.lockId) {
      throw new LockMismatchError(file.lockId);
    }

    const name = this.generateFileName(suggestedTarget);

    const { id } = await this.fileProvider.putFile({
      name: name,
      relatedTo: fileId,
      buffer,
      size: fileSize ?? buffer.length,
    });

    return {
      lockId: file.lockId,
      relatedFileId: id,
    };
  }

  private generateFileName(suggestedTarget: string) {
    const date = new Date().toJSON();
    if (suggestedTarget === extname(suggestedTarget)) {
      return date + suggestedTarget;
    }
    return suggestedTarget;
  }
}
