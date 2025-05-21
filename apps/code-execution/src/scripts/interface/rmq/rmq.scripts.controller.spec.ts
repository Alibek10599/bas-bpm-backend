import { Test, TestingModule } from '@nestjs/testing';
import { RmqScriptsController } from './rmq.scripts.controller';
import { ScriptsService } from '../../application/scripts.service';
import { CreateScriptDto } from '../dto/create-script.dto';
import { MessageMetadata } from '../dto/message.metadata';
import { FindAllScriptsFilterDto } from '../dto/find-all-scripts-filter.dto';
import { UpdateScriptDto } from '../dto/update-script.dto';
import { ScriptIdDto } from '../dto/script-id.dto';
import { ProgrammingLanguages } from '../../infrastructure/enums/programming-languages.enum';

describe('RmqScriptsController', () => {
  let controller: RmqScriptsController;
  let scriptsService: ScriptsService;

  const mockScriptsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqScriptsController],
      providers: [
        {
          provide: ScriptsService,
          useValue: mockScriptsService,
        },
      ],
    }).compile();

    controller = module.get<RmqScriptsController>(RmqScriptsController);
    scriptsService = module.get<ScriptsService>(ScriptsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ScriptsService.create with correct parameters', async () => {
      const metadata: MessageMetadata = {
        tenantId: 'tenant1',
        userId: 'user1',
      };
      const createScriptDto: CreateScriptDto = {
        name: 'Test Script',
        language: ProgrammingLanguages.JS,
        script: 'console.log("Hello World");',
      };

      await controller.create(metadata, createScriptDto);

      expect(scriptsService.create).toHaveBeenCalledWith({
        name: createScriptDto.name,
        language: createScriptDto.language,
        script: createScriptDto.script,
        tenantId: metadata.tenantId,
        userId: metadata.userId,
      });
    });
  });

  describe('findAll', () => {
    it('should call ScriptsService.findAll with correct parameters', async () => {
      const metadata: MessageMetadata = {
        tenantId: 'tenant1',
        userId: 'user1',
      };
      const filter: FindAllScriptsFilterDto = { search: 'Test' };

      await controller.findAll(metadata, filter);

      expect(scriptsService.findAll).toHaveBeenCalledWith({
        ...filter,
        tenantId: metadata.tenantId,
        userId: metadata.userId,
      });
    });
  });

  describe('findOne', () => {
    it('should call ScriptsService.findOne with correct parameters', async () => {
      const scriptIdDto: ScriptIdDto = { scriptId: '123' };

      await controller.findOne(scriptIdDto);

      expect(scriptsService.findOne).toHaveBeenCalledWith(scriptIdDto.scriptId);
    });
  });

  describe('update', () => {
    it('should call ScriptsService.update with correct parameters', async () => {
      const updateScriptDto: UpdateScriptDto = {
        scriptId: '123',
        name: 'Updated Script',
        language: ProgrammingLanguages.TS,
        script: 'console.log("Updated");',
      };

      await controller.update(updateScriptDto);

      expect(scriptsService.update).toHaveBeenCalledWith(
        updateScriptDto.scriptId,
        updateScriptDto,
      );
    });
  });
});
