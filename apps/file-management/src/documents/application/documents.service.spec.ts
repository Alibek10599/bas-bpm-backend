import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { FilesService } from '../../files/application/files.service';
import { DocumentRepository } from '../domain/repository/document.repository';
import { DataSource } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY_TOKEN } from '../domain/repository/document.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let filesService: FilesService;
  let documentRepository: DocumentRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: FilesService,
          useValue: {
            saveFileInTransaction: jest.fn(),
            findOneContent: jest.fn(),
          },
        },
        {
          provide: DOCUMENT_REPOSITORY_TOKEN,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
            findDocumentVersionsById: jest.fn(),
          },
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: {
            transaction: jest.fn((callback) =>
              callback({
                getRepository: jest.fn().mockReturnValue({
                  save: jest.fn(),
                  findOne: jest.fn(),
                }),
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    filesService = module.get<FilesService>(FilesService);
    documentRepository = module.get<DocumentRepository>(
      DOCUMENT_REPOSITORY_TOKEN,
    );
    dataSource = module.get<DataSource>(DATABASE_PROVIDER_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a document and return success message', async () => {
      const mockDocument = { id: '1', name: 'Test Document' };
      const mockVersion = { id: '1', document: mockDocument };
      const mockFile = { id: '1' };

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (callback: any) => {
          const em: any = {
            getRepository: jest.fn().mockReturnValue({
              save: jest
                .fn()
                .mockResolvedValueOnce(mockDocument)
                .mockResolvedValueOnce(mockVersion),
            }),
          };
          return callback(em);
        });

      const result = await service.createDocument({
        name: 'Test Document',
        type: 'application/pdf',
        size: 12345,
        hashName: 'hash123',
        documentType: 'text',
        userId: 'user1',
        tenantId: 'tenant1',
      });

      expect(result).toEqual({
        documentId: mockDocument.id,
        message: 'Document successfully uploaded',
      });
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        { id: '1', name: 'Doc1' },
        { id: '2', name: 'Doc2' },
      ];
      jest
        .spyOn(documentRepository, 'findAll')
        .mockResolvedValue(mockDocuments as any[]);

      const result = await service.findAll();

      expect(result).toEqual(mockDocuments);
      expect(documentRepository.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      const mockDocument = { id: '1', name: 'Test Document' };
      jest
        .spyOn(documentRepository, 'findOneById')
        .mockResolvedValue(mockDocument as any);

      const result = await service.findOne('1');

      expect(result).toEqual(mockDocument);
      expect(documentRepository.findOneById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if document is not found', async () => {
      jest.spyOn(documentRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('Document not found');
    });
  });

  describe('changeDocumentVersion', () => {
    it('should change the document version', async () => {
      const mockDocument = { id: '1', currentVersion: { id: '1' } };
      const mockVersion = { id: '2', document: mockDocument };

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (callback: any) => {
          const em = {
            getRepository: jest.fn().mockReturnValue({
              findOne: jest
                .fn()
                .mockResolvedValueOnce(mockDocument)
                .mockResolvedValueOnce(mockVersion),
              save: jest.fn(),
            }),
          };
          return callback(em);
        });

      const result = await service.changeDocumentVersion('1', '2');

      expect(result).toEqual({
        documentId: mockDocument.id,
        versionId: mockVersion.id,
        message: 'Document version changed successfully',
      });
    });

    it('should throw an error if document is not found', async () => {
      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (callback: any) => {
          const em = {
            getRepository: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValueOnce(null),
            }),
          };
          return callback(em);
        });

      await expect(service.changeDocumentVersion('1', '2')).rejects.toThrow(
        new HttpException('Document not found', 404),
      );
    });

    it('should throw an error if version is not found', async () => {
      const mockDocument = { id: '1', currentVersion: { id: '1' } };

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (callback: any) => {
          const em = {
            getRepository: jest.fn().mockReturnValue({
              findOne: jest
                .fn()
                .mockResolvedValueOnce(mockDocument)
                .mockResolvedValueOnce(null),
            }),
          };
          return callback(em);
        });

      await expect(service.changeDocumentVersion('1', '2')).rejects.toThrow(
        new HttpException('Version not found', 404),
      );
    });
  });
});
