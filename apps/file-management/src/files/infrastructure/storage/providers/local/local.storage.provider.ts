import { StorageProvider } from '../../storage.provider';
import { LocalStorageProviderOptions } from './types/local.storage.provider.options';
import * as crypto from 'node:crypto';
import { extname, resolve } from 'path';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly options: LocalStorageProviderOptions) {
    mkdirSync(resolve(options.path), { recursive: true });
  }

  async get(hashFileName: string): Promise<Buffer> {
    const path = resolve(this.options.path, hashFileName);
    return readFileSync(path);
  }

  async save(file: File): Promise<string> {
    const fileHashName = this.generateFileHashName(extname(file.name));
    const fullPath = resolve(this.options.path, fileHashName);
    const fileBytes = await file.bytes();
    writeFileSync(fullPath, fileBytes);
    return fileHashName;
  }

  private readonly generateFileHashName = (ext: string) => {
    const date = new Date();
    const hash = crypto.randomUUID();
    return date.toJSON() + hash + ext;
  };
}
