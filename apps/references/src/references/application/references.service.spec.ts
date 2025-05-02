import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from './references.service';
import { DataSource, EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReferencesRepository } from '../domain/repository/references.repository';
import { REFERENCES_REPOSITORY_TOKEN } from '../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { Reference } from '../infrastructure/database/postgres/entities/reference.entity';

describe('ReferencesService', () => {
  let service: ReferencesService;
  let repository: ReferencesRepository;
  let dataSource: DataSource;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: REFERENCES_REPOSITORY_TOKEN,
          useValue: {
            findOneById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            findOneOrFail: jest.fn(),
            findOneByOrFail: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: {
            transaction: jest.fn((_, cb) => cb(entityManager)),
          },
        },
      ],
    }).compile();

    service = module.get<ReferencesService>(ReferencesService);
    repository = module.get<ReferencesRepository>(REFERENCES_REPOSITORY_TOKEN);
    dataSource = module.get<DataSource>(DATABASE_PROVIDER_TOKEN);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reference', async () => {
      const createDto = {
        name: 'Test Reference',
        referenceData: [{ type: 'string', key: 'key', value: 'value' }],
      };
      const reference = {
        id: '1',
        ...createDto,
        user_id: 'user1',
        tenant_id: 'tenant1',
      };
      (repository.create as jest.Mock).mockResolvedValue(reference);

      const result = await service.create(createDto, 'user1', 'tenant1');

      expect(result).toEqual({
        referenceId: '1',
        message: 'Reference created successfully',
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        user_id: 'user1',
        tenant_id: 'tenant1',
      });
    });
  });

  describe('findOne', () => {
    it('should return a reference by ID', async () => {
      const reference = { id: '1', name: 'Test Reference' };
      (repository.findOneById as jest.Mock).mockResolvedValue(reference);

      const result = await service.findOne('1');
      expect(result).toEqual(reference);
    });

    it('should throw NotFoundException if reference does not exist', async () => {
      (repository.findOneById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all references for a tenant', async () => {
      const references = [
        { id: '1', name: 'Ref1' },
        { id: '2', name: 'Ref2' },
      ];
      (repository.findAll as jest.Mock).mockResolvedValue(references);

      const result = await service.findAll('tenant1');
      expect(result).toEqual(references);
    });
  });

  describe('update', () => {
    it('should update a reference and create a version', async () => {
      const updateDto = { name: 'Updated Name' };
      const reference = { id: '1', name: 'Old Name', version: 1 };
      const updatedReference = { ...reference, ...updateDto, version: 2 };
      const versionData = { name: { old: 'Old Name', new: 'Updated Name' } };

      const mockEntityManager = {
        findOneOrFail: jest.fn().mockResolvedValue(reference),
        findOne: jest.fn().mockResolvedValue({ version: 1 }),
        save: jest
          .fn()
          .mockResolvedValueOnce(updatedReference) // Save updated reference
          .mockResolvedValueOnce({
            reference: updatedReference,
            version: 2,
            data: versionData,
          }),
      };

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (_, callback) => {
          return callback(mockEntityManager as unknown as EntityManager);
        });

      const result = await service.update('1', updateDto, 'user1');

      expect(result).toEqual({
        referenceId: '1',
        message: 'Reference updated successfully',
      });
      expect(mockEntityManager.findOneOrFail).toHaveBeenCalledWith(Reference, {
        where: { id: '1' },
        relations: ['referenceData'],
      });
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
    });
  });
});
