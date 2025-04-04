import { StorageProvider } from '../../storage.provider';
import { Promise } from 'mongoose';
import { File } from '../../../database/postgres/entities/file.entity';
import { MinioStorageProviderOptions } from './types/minio.storage.provider.options';

export class MinioStorageProvider implements StorageProvider {
  constructor(private readonly options: MinioStorageProviderOptions) {}
  get(fileId: string): Promise<Buffer> {
    return Promise.resolve(undefined);
  }

  save(file: File): Promise<string> {
    return Promise.resolve('');
  }
}
