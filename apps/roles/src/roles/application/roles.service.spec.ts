import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from '../domain/repository/roles.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repository/roles.repository.token';

describe('RolesService', () => {
  let service: RolesService;
  let repository: jest.Mocked<RolesRepository>;

  beforeEach(async () => {
    const mockRepository = {
      createRole: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findAllTree: jest.fn(),
      updateRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
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
      expect(result).toEqual(createdRoleDto);
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
      const tree = [
        { id: '1', name: 'Admin', children: [], createdAt: '', updatedAt: '' },
      ];
      repository.findAllTree.mockResolvedValue(tree);

      const result = await service.findAllTree();

      expect(repository.findAllTree).toHaveBeenCalled();
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
      repository.updateRole.mockResolvedValue(updatedRoleDto);

      const result = await service.update('uid-1', updateRoleDto);

      expect(repository.updateRole).toHaveBeenCalledWith(
        'uid-1',
        updateRoleDto,
      );
      expect(result).toEqual(updatedRoleDto);
    });
  });
});
