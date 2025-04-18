import { Test, TestingModule } from '@nestjs/testing';
import { ScriptsService } from './scripts.service';
import { ScriptRepository } from '../domain/repository/script.repository';
import { ScriptsRepositoryToken } from '../domain/repository/script.repository.token';
import { ProgrammingLanguages } from '../infrastructure/enums/programming-languages.enum';

describe('ScriptsService', () => {
  let service: ScriptsService;
  let scriptRepository: ScriptRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScriptsService,
        {
          provide: ScriptsRepositoryToken,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScriptsService>(ScriptsService);
    scriptRepository = module.get<ScriptRepository>(ScriptsRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a script', async () => {
      const createScriptDto = {
        name: 'Test Script',
        script: 'console.log("Hello");',
        language: ProgrammingLanguages.JS,
        createdAt: '',
        updatedAt: '',
        tenantId: '',
        userId: '',
      };
      const createdScript = { id: '1', ...createScriptDto };

      jest.spyOn(scriptRepository, 'create').mockResolvedValue(createdScript);

      const result = await service.create(createScriptDto);

      expect(result).toEqual(createdScript);
      expect(scriptRepository.create).toHaveBeenCalledWith(createScriptDto);
    });
  });

  describe('findAll', () => {
    it('should return all scripts', async () => {
      const filter = { search: 'Test' };
      const scripts = [
        {
          id: '1',
          name: 'Test Script',
          script: 'console.log("Hello");',
          language: ProgrammingLanguages.JS,
          createdAt: '',
          updatedAt: '',
          tenantId: '',
          userId: '',
        },
      ];

      jest.spyOn(scriptRepository, 'findAll').mockResolvedValue(scripts);

      const result = await service.findAll(filter);

      expect(result).toEqual(scripts);
      expect(scriptRepository.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a script by ID', async () => {
      const script = {
        id: '1',
        name: 'Test Script',
        script: 'console.log("Hello");',
        language: ProgrammingLanguages.JS,
        createdAt: '',
        updatedAt: '',
        tenantId: '',
        userId: '',
      };

      jest.spyOn(scriptRepository, 'findOneById').mockResolvedValue(script);

      const result = await service.findOne('1');

      expect(result).toEqual(script);
      expect(scriptRepository.findOneById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if script is not found', async () => {
      jest.spyOn(scriptRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('Script not found');
    });
  });

  describe('update', () => {
    it('should update a script', async () => {
      const updateScriptDto = {
        name: 'Updated Script',
        script: 'console.log("Updated");',
        language: ProgrammingLanguages.JS,
        createdAt: '',
        updatedAt: '',
        tenantId: '',
        userId: '',
      };
      const updatedScript = { id: '1', ...updateScriptDto };

      jest.spyOn(scriptRepository, 'update').mockResolvedValue(updatedScript);

      const result = await service.update('1', updateScriptDto);

      expect(result).toEqual(updatedScript);
      expect(scriptRepository.update).toHaveBeenCalledWith(
        '1',
        updateScriptDto,
      );
    });
  });
});
