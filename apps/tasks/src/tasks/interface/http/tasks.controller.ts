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
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskHttpDto } from './dto/update-task-http.dto';
import { FindAllTasksFilter } from '../../domain/repository/types/find-all-tasks-filter';
import { AccessGuard, CurrentUser } from '@app/common';
import { AssignTaskHttpDto } from './dto/assign-task-http.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard, AccessGuard(['tasks.create']))
  @Post()
  create(@CurrentUser() user: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create({
      ...createTaskDto,
      tenantId: user.tenantId,
      userId: user.userId,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllPaginated(query: FindAllTasksFilter) {
    return this.tasksService.findAllPaginated(query);
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  findAll(@Query() query: FindAllTasksFilter) {
    return this.tasksService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/status')
  findOneTaskStatus(@Param('id') id: string) {
    return this.tasksService.findOneTaskStatus(id);
  }

  @UseGuards(AuthGuard, AccessGuard(['tasks.delegate']))
  @Patch(':id/assign')
  assignTask(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskHttpDto,
  ) {
    return this.tasksService.assignTask(
      id,
      assignTaskDto.assignedTo,
      user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id/complete')
  completeTask(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.completeTask(id, user.userId);
  }

  @UseGuards(AuthGuard, AccessGuard(['tasks.update']))
  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskHttpDto,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.userId);
  }
}
