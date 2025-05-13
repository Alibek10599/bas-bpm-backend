import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesService } from './privileges.service';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../domain/repository/privileges.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../../roles/src/database/database-provider-token.const';
import { DataSource } from 'typeorm';

describe('PrivilegesService', () => {
  let service: PrivilegesService;
  let privilegesRepository: any;
  let dataSource: DataSource;

  beforeEach(async () => {
    privilegesRepository = {
      createPrivilege: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
    };

    dataSource = {
      transaction: jest.fn(),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivilegesService,
        {
          provide: PRIVILEGES_REPOSITORY_TOKEN,
          useValue: privilegesRepository,
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<PrivilegesService>(PrivilegesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call createPrivilege and return the result', async () => {
      const createPrivilegeDto = {
        name: 'Test Privilege',
        accesses: {} as any,
      };
      const createdPrivilege = { id: '1', ...createPrivilegeDto };
      privilegesRepository.createPrivilege.mockResolvedValue(createdPrivilege);

      const result = await service.create(createPrivilegeDto);

      expect(privilegesRepository.createPrivilege).toHaveBeenCalledWith(
        createPrivilegeDto,
      );
      expect(result).toEqual({
        message: 'Privilege successfully created',
        privilegeId: '1',
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll and return the result', async () => {
      const privileges = [{ id: '1', name: 'Test Privilege' }];
      privilegesRepository.findAll.mockResolvedValue(privileges);

      const result = await service.findAll();

      expect(privilegesRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(privileges);
    });
  });

  describe('findOne', () => {
    it('should call findOneById and return the result', async () => {
      const privilege = { id: '1', name: 'Test Privilege' };
      privilegesRepository.findOneById.mockResolvedValue(privilege);

      const result = await service.findOne('1');

      expect(privilegesRepository.findOneById).toHaveBeenCalledWith('1');
      expect(result).toEqual(privilege);
    });
  });

  describe('update', () => {
    it('should call transaction and return the result', async () => {
      const updatePrivilegeDto = { name: 'Updated Privilege' };
      const privilege = { id: '1', name: 'Test Privilege' };
      const updatedPrivilege = { id: '1', ...updatePrivilegeDto };
      const lastVersion = { version: 1 };

      dataSource.transaction = jest.fn().mockImplementation(async (cb) =>
        cb({
          findOneBy: jest.fn().mockResolvedValue(privilege),
          findOne: jest.fn().mockResolvedValue(lastVersion),
          save: jest.fn().mockResolvedValue(updatedPrivilege),
        }),
      );

      const result = await service.update('user1', '1', updatePrivilegeDto);

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Privilege successfully updated',
        privilegeId: '1',
      });
    });
  });
});
