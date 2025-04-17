import { ExecutionContext, createParamDecorator } from '@nestjs/common';

function getCurrentUserByContext(_data: unknown, context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();

  return request.user;
}

export const CurrentUser = createParamDecorator(getCurrentUserByContext);
