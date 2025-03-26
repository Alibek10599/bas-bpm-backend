import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../../application/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllTasksFilter } from '../../domain/repository/types/find-all-tasks-filter';
import { CurrentUser } from '@app/common';
import { JwtAuthGuard } from '../../../../../auth/src/guards/jwt-auth.guard';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: createTaskDto.status,
      type: createTaskDto.taskType,
      assigned_to: createTaskDto.assignedTo,
      tenant_id: user.tenantId,
      metadata: createTaskDto.metadata,
      user_id: user.userId,
      workflow_instance_id: createTaskDto.workflowInstanceId,
    });
  }

  @Get()
  findAllPaginated(query: FindAllTasksFilter) {
    return this.tasksService.findAllPaginated(query);
  }

  @Get('/list')
  findAll(@Query() query: FindAllTasksFilter) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Get(':id/status')
  findOneTaskStatus(@Param('id') id: string) {
    return this.tasksService.findOneTaskStatus(id);
  }

  @Patch(':id/assign')
  assignTask(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.tasksService.assignTask(
      id,
      assignTaskDto.assignTo,
      user.userId,
    );
  }

  @Patch(':id/complete')
  completeTask(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.completeTask(id, user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, {
      name: updateTaskDto.name,
      description: updateTaskDto.description,
      metadata: updateTaskDto.metadata,
      type: updateTaskDto.taskType,
      workflow_instance_id: updateTaskDto.workflowInstanceId,
    });
  }
}
