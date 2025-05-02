import { LocalStorageProviderOptions } from './types/local.storage.provider.options';
import { resolve } from 'path';
import * as fs from 'fs';
import { LocalStorageProvider } from './local.storage.provider';
import { StorageProvider } from '../../storage.provider';
import * as crypto from 'node:crypto';

jest.mock('node:crypto');

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(() => Buffer.from('mocked buffer')),
}));

describe('LocalStorageProvider', () => {
  const options: LocalStorageProviderOptions = { path: '/tmp/storage' };
  let provider: StorageProvider;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('mocked-uuid-1-1-1');

    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    provider = new LocalStorageProvider(options);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create storage directory on init', () => {
    expect(fs.mkdirSync).toHaveBeenCalledWith(resolve(options.path), {
      recursive: true,
    });
  });

  it('should save file and return hash name', async () => {
    const fakeFile = {
      name: 'test.txt',
      buffer: Buffer.from('file content'),
    } as any;

    const fileName = await provider.save(fakeFile);

    expect(fileName).toBe('2023-01-01T00:00:00.000Zmocked-uuid-1-1-1.txt');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      resolve(options.path, fileName),
      Buffer.from('file content'),
    );
  });

  it('should get file as buffer', async () => {
    const fileName = 'mocked-file.txt';
    const result = await provider.get(fileName);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      resolve(options.path, fileName),
    );
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toEqual('mocked buffer');
  });
});
