import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (DtoClass: new (...args: any[]) => object, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const dto = plainToInstance(DtoClass, headers, {
      excludeExtraneousValues: true,
    });

    const result = await validate(dto);

    if (result.length > 0) {
      const errors = result
        .map((e) => ({ [e.property]: e.constraints }))
        .reduce((a, b) => ({ ...a, ...b }), {});
      throw new HttpException(
        {
          message: 'Headers validation error',
          errors,
        },
        400,
        {
          cause: result,
        },
      );
    }

    return dto;
  },
);
