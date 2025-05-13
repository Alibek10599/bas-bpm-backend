import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from '../domain/repository/roles.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repository/roles.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { DataSource } from 'typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let repository: jest.Mocked<RolesRepository>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const mockRepository = {
      createRole: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      updateRole: jest.fn(),
    };

    dataSource = {
      transaction: jest.fn((cb) =>
        cb({
          findOneBy: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
        }),
      ),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: dataSource,
        },
        RolesService,
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<RolesRepository>(
      ROLE_REPOSITORY_TOKEN,
    ) as jest.Mocked<RolesRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call createRole with correct parameters', async () => {
      const createRoleDto = {
        name: 'Admin',
        tenantId: 'tenant1',
        userId: 'user1',
      };
      const expextedResult = {
        roleId: 'uid-1',
        message: 'Role successfully created',
      };
      const createdRoleDto = {
        id: 'uid-1',
        name: 'Admin',
        tenantId: 'tenant1',
        userId: 'user1',
        parent: null,
        children: [],
        createdAt: '',
        updatedAt: '',
      };
      repository.createRole.mockResolvedValue(createdRoleDto);

      const result = await service.create(createRoleDto);

      expect(repository.createRole).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual(expextedResult);
    });
  });

  describe('findAll', () => {
    it('should call findAll and return the result', async () => {
      const roles = [
        {
          id: 'uid-1',
          name: 'Admin',
          tenantId: 'tenant1',
          userId: 'user1',
          parent: null,
          children: [],
          createdAt: '',
          updatedAt: '',
        },
      ];
      repository.findAll.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should call findOneById with correct id and return the result', async () => {
      const role = {
        id: 'uid-1',
        name: 'Admin',
        tenantId: 'tenant1',
        userId: 'user1',
        parent: null,
        children: [],
        createdAt: '',
        updatedAt: '',
      };
      repository.findOneById.mockResolvedValue(role);

      const result = await service.findOne('uid-1');

      expect(repository.findOneById).toHaveBeenCalledWith('uid-1');
      expect(result).toEqual(role);
    });
  });

  describe('findAllTree', () => {
    it('should call findAllTree and return the result', async () => {
      const roles = [
        {
          id: 'uid-1',
          name: 'Admin',
          children: [],
          createdAt: '',
          updatedAt: '',
        },
      ];
      const tree = [
        {
          id: 'uid-1',
          name: 'Admin',
          children: [],
          createdAt: '',
          updatedAt: '',
        },
      ];

      repository.findAll.mockResolvedValue(roles);

      const result = await service.findAllTree();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(tree);
    });
  });

  describe('update', () => {
    it('should call updateRole with correct parameters', async () => {
      const updateRoleDto = { roleId: 'uid-1', name: 'Updated Admin' };
      const updatedRoleDto = {
        id: 'uid-1',
        name: 'Updated Admin',
        tenantId: 'tenant1',
        userId: 'user1',
        parent: null,
        children: [],
        createdAt: '',
        updatedAt: '',
      };
      const expextedResult = {
        roleId: 'uid-1',
        message: 'Role successfully updated',
      };

      (dataSource.transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          findOneBy: jest.fn().mockResolvedValue(updatedRoleDto),
          findOne: jest.fn().mockResolvedValue(updatedRoleDto),
          save: jest.fn().mockResolvedValue({ ...updateRoleDto }),
        }),
      );

      const result = await service.update('1', 'uid-1', updateRoleDto);

      expect(result).toEqual(expextedResult);
    });
  });
});
