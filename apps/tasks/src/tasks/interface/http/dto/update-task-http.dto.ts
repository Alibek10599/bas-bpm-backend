import { OmitType } from '@nestjs/mapped-types';
import { UpdateTaskDto } from '../../dto/update-task.dto';

export class UpdateTaskHttpDto extends OmitType(UpdateTaskDto, ['taskId']) {}
