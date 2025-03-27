import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskType } from '../../../infrastructure/enums/task-types.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TaskTypeEnumInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call = context.switchToRpc().getData();

    call.type = this.mapStrategy(call.type);

    return next.handle();
  }

  private mapStrategy(type: any): TaskType {
    switch (type) {
      case 1:
        return TaskType.WORKFLOW;
      case 2:
        return TaskType.GENERAL;
      default:
        throw new RpcException('Undefined strategy');
    }
  }
}
