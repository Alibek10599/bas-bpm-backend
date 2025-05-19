import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FILES_REPOSITORY_TOKEN } from '../domain/repository/files.repository.token';
import { STORAGE_PROVIDER_TOKEN } from '../infrastructure/storage/providers/storage.provider.token';
import { DocumentTypes } from '../../documents/infrastructure/enums/document-types.enum';

describe('FilesService', () => {
  let service: FilesService;
  let filesRepositoryMock: any;
  let storageProviderMock: any;

  beforeEach(async () => {
    filesRepositoryMock = {
      createFile: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
    };

    storageProviderMock = {
      save: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FILES_REPOSITORY_TOKEN,
          useValue: filesRepositoryMock,
        },
        {
          provide: STORAGE_PROVIDER_TOKEN,
          useValue: storageProviderMock,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveFile', () => {
    it('should save a file and return success message', async () => {
      const createFileDto = {
        name: 'test.txt',
        buffer: Buffer.from('test content'),
        type: 'text/plain',
        userId: 'user1',
        tenantId: 'tenant1',
      };

      const mockFile = { id: '1' };
      storageProviderMock.save.mockResolvedValue('hash123');
      filesRepositoryMock.createFile.mockResolvedValue(mockFile);

      const result = await service.saveFile(createFileDto);

      expect(result).toEqual({
        fileId: mockFile.id,
        message: 'File successfully uploaded',
      });
      expect(storageProviderMock.save).toHaveBeenCalledWith({
        name: createFileDto.name,
        buffer: createFileDto.buffer,
      });
      expect(filesRepositoryMock.createFile).toHaveBeenCalledWith({
        name: createFileDto.name,
        hashName: 'hash123',
        size: createFileDto.buffer.length,
        type: createFileDto.type,
        userId: createFileDto.userId,
        tenantId: createFileDto.tenantId,
      });
    });
  });

  describe('findAll', () => {
    it('should return all files', async () => {
      const mockFiles = [
        { id: '1', name: 'file1' },
        { id: '2', name: 'file2' },
      ];
      filesRepositoryMock.findAll.mockResolvedValue(mockFiles);

      const result = await service.findAll({});

      expect(result).toEqual(mockFiles);
      expect(filesRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a file by ID', async () => {
      const mockFile = { id: '1', name: 'file1' };
      filesRepositoryMock.findOneById.mockResolvedValue(mockFile);

      const result = await service.findOne('1');

      expect(result).toEqual(mockFile);
      expect(filesRepositoryMock.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('findOneContent', () => {
    it('should return a file with its content', async () => {
      const mockFile = { id: '1', name: 'file1', hashName: 'hash123' };
      const mockBuffer = Buffer.from('file content');
      filesRepositoryMock.findOneById.mockResolvedValue(mockFile);
      storageProviderMock.get.mockResolvedValue(mockBuffer);

      const result = await service.findOneContent('1');

      expect(result).toEqual({ ...mockFile, buffer: mockBuffer });
      expect(filesRepositoryMock.findOneById).toHaveBeenCalledWith('1');
      expect(storageProviderMock.get).toHaveBeenCalledWith('hash123');
    });
  });

  describe('createEmptyFile', () => {
    it('should create an empty file and return success message', async () => {
      const createEmptyFileDto = {
        name: 'empty.docx',
        type: DocumentTypes.WORD,
        userId: 'user1',
        tenantId: 'tenant1',
      };

      const mockFile = { id: '1' };
      const mockBuffer = Buffer.from('empty file content');
      jest
        .spyOn(service as any, 'getEmptyFileByDocumentType')
        .mockResolvedValue(mockBuffer);
      storageProviderMock.save.mockResolvedValue('hash123');
      filesRepositoryMock.createFile.mockResolvedValue(mockFile);

      const result = await service.createEmptyFile(createEmptyFileDto);

      expect(result).toEqual({
        fileId: mockFile.id,
        message: 'File successfully created',
      });
      expect(storageProviderMock.save).toHaveBeenCalledWith({
        name: createEmptyFileDto.name,
        buffer: mockBuffer,
      });
      expect(filesRepositoryMock.createFile).toHaveBeenCalledWith({
        name: createEmptyFileDto.name,
        hashName: 'hash123',
        size: mockBuffer.length,
        type: createEmptyFileDto.type,
        userId: createEmptyFileDto.userId,
        tenantId: createEmptyFileDto.tenantId,
      });
    });
  });
});
