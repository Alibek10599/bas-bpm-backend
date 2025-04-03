import { AssignTaskDto } from '../../dto/assign-task.dto';
import { OmitType } from '@nestjs/mapped-types';

export class AssignTaskHttpDto extends OmitType(AssignTaskDto, ['taskId']) {}
