import { TasksService } from './tasks.service';
import { DataSource } from 'typeorm';
import { TaskRepository } from '../domain/repository/task.repository';
import { TaskStatuses } from '../infrastructure/enums/task-statuses.enum';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: TaskRepository;
  let dataSource: DataSource;

  beforeEach(() => {
    taskRepository = {
      createTask: jest.fn(),
      findOneById: jest.fn(),
      updateTask: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
    } as unknown as TaskRepository;

    dataSource = {
      transaction: jest.fn((_, cb) =>
        cb({
          getRepository: jest.fn(() => ({
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          })),
        }),
      ),
    } as unknown as DataSource;

    service = new TasksService(taskRepository, dataSource);
  });

  /*** 1️⃣ Создание задачи ***/
  it('should create a task successfully', async () => {
    const taskData = { name: 'Test Task' };
    const createdTask = { id: '123', ...taskData };

    (taskRepository.createTask as jest.Mock).mockResolvedValue(createdTask);

    const result = await service.create(taskData as any);

    expect(result).toEqual({
      taskId: '123',
      message: 'Task created successfully',
    });
  });

  /*** 2️⃣ Поиск задачи по ID ***/
  it('should find a task by ID', async () => {
    const task = { id: '123', name: 'Test Task' };
    (taskRepository.findOneById as jest.Mock).mockResolvedValue(task);

    const result = await service.findOne('123');

    expect(result).toEqual(task);
  });

  /*** 3️⃣ Ошибка при поиске несуществующей задачи ***/
  it('should throw an error if task not found', async () => {
    (taskRepository.findOneById as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrowError(
      'Task does not exist',
    );
  });

  /*** 4️⃣ Обновление задачи ***/
  it('should update a task', async () => {
    const task = { id: '123', name: 'Old Task' };
    const updateData = { name: 'New Task' };
    const updatedTask = { ...task, ...updateData };

    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneBy: jest.fn().mockResolvedValue(task),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue(updatedTask),
        }),
      }),
    );

    const result = await service.update('123', updateData as any, 'user1');

    expect(result).toEqual({
      taskId: '123',
      message: 'Task updated successfully',
    });
  });

  /*** 5️⃣ Ошибка при обновлении несуществующей задачи ***/
  it('should throw an error if task does not exist', async () => {
    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneBy: jest.fn().mockResolvedValue(null),
        }),
      }),
    );

    await expect(
      service.update('999', {} as any, 'user1'),
    ).rejects.toThrowError('Task with id 999 not found');
  });

  /*** 6️⃣ Назначение задачи пользователю ***/
  it('should assign a task to a user', async () => {
    const task = { id: '123', assignedTo: null };

    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneBy: jest.fn().mockResolvedValue(task),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue({ ...task, assignedTo: 'user2' }),
        }),
      }),
    );

    const result = await service.assignTask('123', 'user2', 'admin');

    expect(result).toEqual({
      taskId: '123',
      assignedTo: 'user2',
      message: 'Task assigned successfully',
    });
  });

  /*** 7️⃣ Ошибка при назначении несуществующей задачи ***/
  it('should throw an error if task to assign is not found', async () => {
    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneBy: jest.fn().mockResolvedValue(null),
        }),
      }),
    );

    await expect(
      service.assignTask('999', 'user2', 'admin'),
    ).rejects.toThrowError('Task with id 999 not found');
  });

  /*** 8️⃣ Завершение задачи ***/
  it('should complete a task', async () => {
    const task = { id: '123', status: TaskStatuses.PENDING };

    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneByOrFail: jest.fn().mockResolvedValue(task),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest
            .fn()
            .mockResolvedValue({ ...task, status: TaskStatuses.COMPLETED }),
        }),
      }),
    );

    const result = await service.completeTask('123', 'user1');

    expect(result).toEqual({
      taskId: '123',
      status: TaskStatuses.COMPLETED,
      message: 'Task completed successfully',
    });
  });

  /*** 9️⃣ Ошибка при завершении несуществующей задачи ***/
  it('should throw an error if task to complete is not found', async () => {
    (dataSource.transaction as jest.Mock).mockImplementation(async (_, cb) =>
      cb({
        getRepository: () => ({
          findOneByOrFail: jest.fn().mockRejectedValue(new Error('Not Found')),
        }),
      }),
    );

    await expect(service.completeTask('999', 'user1')).rejects.toThrowError(
      'Not Found',
    );
  });
});
