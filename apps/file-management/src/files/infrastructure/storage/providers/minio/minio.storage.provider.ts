import { StorageProvider } from '../../storage.provider';
import { MinioStorageProviderOptions } from './types/minio.storage.provider.options';
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import * as crypto from 'node:crypto';
import { extname } from 'path';
import { Buffer } from 'buffer';

export class MinioStorageProvider implements StorageProvider {
  static async init(
    options: MinioStorageProviderOptions,
  ): Promise<MinioStorageProvider> {
    const provider = new MinioStorageProvider(options);
    await provider.createBucketIfNotExists(options.bucketName);
    return provider;
  }
  constructor(private readonly options: MinioStorageProviderOptions) {}

  private async createBucketIfNotExists(bucketName: string) {
    try {
      await this.options.client.send(
        new HeadBucketCommand({ Bucket: bucketName }),
      );
    } catch (error: any) {
      if (error.$metadata?.httpStatusCode === 404) {
        await this.options.client.send(
          new CreateBucketCommand({ Bucket: bucketName }),
        );
      } else {
        throw error;
      }
    }
  }

  async get(fileId: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.options.bucketName,
      Key: fileId,
    });

    const response = await this.options.client.send(command);
    const stream = response.Body;

    const reader = stream.transformToWebStream().getReader();

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  }

  async save(file: { name: string; buffer: Buffer }): Promise<string> {
    const fileHashName = this.generateFileHashName(extname(file.name));
    const command = new PutObjectCommand({
      Bucket: this.options.bucketName,
      Key: fileHashName,
      Body: file.buffer,
    });

    await this.options.client.send(command);
    return fileHashName;
  }

  private readonly generateFileHashName = (ext: string) => {
    const date = new Date();
    const hash = crypto.randomUUID();
    return date.toJSON() + hash + ext;
  };
}
