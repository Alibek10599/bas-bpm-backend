import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokensService } from './api-tokens.service';
import { ApiTokensRepository } from '../domain/repository/api-tokens.repository';
import { API_TOKENS_REPOSITORY } from '../domain/repository/api-tokens.repository.token';
import { ApiTokenAccessType } from '../domain/enums/api-token-access-type.enum';

describe('ApiTokensService', () => {
  let service: ApiTokensService;
  let repository: jest.Mocked<ApiTokensRepository>;

  beforeEach(async () => {
    const mockRepository = {
      createApiToken: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByToken: jest.fn(),
      updateApiToken: jest.fn(),
      deleteApiToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiTokensService,
        {
          provide: API_TOKENS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ApiTokensService>(ApiTokensService);
    repository = module.get(API_TOKENS_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new API token', async () => {
      const createApiTokenDto = {
        name: 'Test',
        accessType: 'api_actor',
        expiredAt: '2023-12-31',
        tenantId: '1',
        userId: '1',
      };
      const mockResult = {
        id: '123',
        ...createApiTokenDto,
        accessType: ApiTokenAccessType.API_ACTOR,
        token: 'generated-token',
        expiredAt: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.createApiToken.mockResolvedValue(mockResult);

      const result = await service.create({
        ...createApiTokenDto,
        accessType: ApiTokenAccessType.API_ACTOR,
      });

      expect(repository.createApiToken).toHaveBeenCalledWith(
        expect.objectContaining(createApiTokenDto),
      );
      expect(result).toEqual({
        apiTokenId: '123',
        token: expect.any(String),
        message: 'Api token created successfully',
      });
    });
  });

  describe('findAll', () => {
    it('should return all API tokens', async () => {
      const mockTokens = [
        {
          id: '1',
          name: 'Test1',
          accessType: ApiTokenAccessType.API_ACTOR,
          token: 'generated-token',
          expiredAt: new Date('2023-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '',
          tenantId: '',
        },
        {
          id: '2',
          name: 'Test2',
          accessType: ApiTokenAccessType.API_ACTOR,
          token: 'generated-token',
          expiredAt: new Date('2023-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '',
          tenantId: '',
        },
      ];
      repository.findAll.mockResolvedValue(mockTokens);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTokens);
    });
  });

  describe('findOne', () => {
    it('should return a single API token by ID', async () => {
      const mockToken = {
        id: '123',
        name: 'Test',
        accessType: ApiTokenAccessType.API_ACTOR,
        token: 'generated-token',
        expiredAt: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '',
        tenantId: '',
      };
      repository.findOneById.mockResolvedValue(mockToken);

      const result = await service.findOne('1');

      expect(repository.findOneById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockToken);
    });
  });

  describe('update', () => {
    it('should update an API token', async () => {
      const updateApiTokenDto = { name: 'Updated Token' };
      repository.updateApiToken.mockResolvedValue(undefined);

      const result = await service.update('1', updateApiTokenDto);

      expect(repository.updateApiToken).toHaveBeenCalledWith(
        '1',
        updateApiTokenDto,
      );
      expect(result).toEqual({
        apiTokenId: '1',
        message: 'Api token updated successfully',
      });
    });
  });

  describe('remove', () => {
    it('should remove an API token', async () => {
      repository.deleteApiToken.mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(repository.deleteApiToken).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        apiTokenId: '1',
        message: 'Api token removed successfully',
      });
    });
  });
});
