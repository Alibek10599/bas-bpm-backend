import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { NotificationStrategy } from '../../../application/enums/notification-strategies.enum';
import { Languages } from '../../../../shared/languages/languages.enum';
import { EmailTemplatesEnum } from '../../../../templates/shared/enums/email.templates.enum';

@Injectable()
export class SendNotificationsEnumInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call = context.switchToRpc().getData();

    call.strategy = this.mapStrategy(call.strategy);
    call.language = this.mapLanguage(call.language);
    call.templateId = this.mapTemplateId(call.options?.templateId);

    return next.handle();
  }

  private mapStrategy(strategy: any): NotificationStrategy {
    switch (strategy) {
      case 1:
        return NotificationStrategy.Email;
      case 2:
        return NotificationStrategy.Sms;
      default:
        throw new RpcException('Undefined strategy');
    }
  }

  private mapLanguage(language: any): Languages {
    switch (language) {
      case 1:
        return Languages.en;
      case 2:
        return Languages.ru;
      default:
        throw new RpcException('Undefined language');
    }
  }

  private mapTemplateId(templateId: any): EmailTemplatesEnum {
    switch (templateId) {
      case 1:
        return EmailTemplatesEnum.WELCOME;
      case 2:
        return EmailTemplatesEnum.FORGOT_PASSWORD;
      default:
        throw new RpcException('Undefined templateId');
    }
  }
}
