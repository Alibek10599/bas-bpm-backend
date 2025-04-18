import { Test, TestingModule } from '@nestjs/testing';
import { CodeExecutionService } from './code-execution.service';
import { ScriptsService } from '../../scripts/application/scripts.service';
import { CodeExecutionRepository } from '../domain/code-execution.repository';
import { CodeExecutionRepositoryToken } from '../domain/code-execution.repository.token';
import { ProgrammingLanguages } from '../../scripts/infrastructure/enums/programming-languages.enum';
import { HttpException } from '@nestjs/common';

jest.mock('isolated-vm', () => ({
  Isolate: jest.fn().mockImplementation(() => ({
    createContext: jest.fn().mockResolvedValue({
      global: {
        setSync: jest.fn(),
        derefInto: jest.fn(),
        set: jest.fn(),
      },
    }),
    compileScript: jest.fn().mockResolvedValue({
      run: jest.fn().mockImplementation(async () => {
        return 'Mocked script result';
      }),
    }),
  })),
  Context: jest.fn(),
  ExternalCopy: jest.fn().mockImplementation(() => ({
    copyInto: jest.fn(),
  })),
}));

describe('CodeExecutionService', () => {
  let service: CodeExecutionService;
  let scriptsService: ScriptsService;
  let codeExecutionRepository: CodeExecutionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeExecutionService,
        {
          provide: ScriptsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CodeExecutionRepositoryToken,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CodeExecutionService>(CodeExecutionService);
    scriptsService = module.get<ScriptsService>(ScriptsService);
    codeExecutionRepository = module.get<CodeExecutionRepository>(
      CodeExecutionRepositoryToken,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeScript', () => {
    it('should execute a script and save the result', async () => {
      const mockScript = {
        id: '1',
        name: 'Test Script',
        script: 'console.log("Hello");',
        language: ProgrammingLanguages.JS,
        createdAt: '',
        updatedAt: '',
        tenantId: '',
        userId: '',
      };
      const mockInput = {
        scriptId: '1',
        context: {},
        tenantId: 'tenant1',
        userId: 'user1',
      };

      jest.spyOn(scriptsService, 'findOne').mockResolvedValue(mockScript);
      jest.spyOn(codeExecutionRepository, 'create').mockResolvedValue(null);

      const result = await service.executeScript(mockInput);

      expect(result).toEqual({ scriptId: '1', status: 'OK' });
      expect(scriptsService.findOne).toHaveBeenCalledWith('1');
      expect(codeExecutionRepository.create).toHaveBeenCalledWith({
        scriptId: '1',
        execution_time_ms: expect.any(Number),
        result: expect.any(Object),
        tenantId: 'tenant1',
        userId: 'user1',
      });
    });

    it('should throw an error if script is not found', async () => {
      jest.spyOn(scriptsService, 'findOne').mockResolvedValue(null);

      const mockInput = {
        scriptId: '1',
        context: {},
        tenantId: 'tenant1',
        userId: 'user1',
      };

      await expect(service.executeScript(mockInput)).rejects.toThrow(
        new HttpException('Script not found', 404),
      );
    });
  });

  describe('getCodeExecutionHistory', () => {
    it('should return execution history', async () => {
      const mockFilter = {
        scriptId: '1',
        userId: 'user1',
        tenantId: 'tenant1',
      };
      const mockHistory = [
        {
          id: '1',
          scriptId: '1',
          userId: 'user1',
          tenantId: 'tenant1',
          script: {
            id: '1',
            name: 'Test Script',
            script: 'console.log("Hello");',
            language: ProgrammingLanguages.JS,
            createdAt: '',
            updatedAt: '',
            tenantId: '',
            userId: '',
          },
          execution_time_ms: 1,
          createdAt: '',
          updatedAt: '',
          result: { status: 'success', data: 'Hello, World!' },
        },
      ];

      jest
        .spyOn(codeExecutionRepository, 'findAll')
        .mockResolvedValue(mockHistory);

      const result = await service.getCodeExecutionHistory(mockFilter);

      expect(result).toEqual(mockHistory);
      expect(codeExecutionRepository.findAll).toHaveBeenCalledWith(mockFilter);
    });
  });
});
