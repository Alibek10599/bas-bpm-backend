import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ProgrammingLanguages } from '../../../infrastructure/enums/programming-languages.enum';

export class ProgrammingLanguageEnumInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const call = context.switchToRpc().getData();

    call.language = this.mapProgrammingLanguage(call.language);

    return next.handle();
  }

  private mapProgrammingLanguage(type: any): ProgrammingLanguages {
    switch (type) {
      case 1:
        return ProgrammingLanguages.JS;
      case 2:
        return ProgrammingLanguages.TS;
      case 3:
        return ProgrammingLanguages.Python;
      default:
        throw new RpcException('Undefined programming language');
    }
  }
}
