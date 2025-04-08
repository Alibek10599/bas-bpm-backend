import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { LockFileHeader } from '@app/common/api/only-office/src/headers/lock-file.headers';
import { RenameFileHeaders } from '@app/common/api/only-office/src/headers/rename-file.headers';
import { PutRelativeFileHeaders } from '@app/common/api/only-office/src/headers/put-relative-file.headers';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const UpdateFileHeaders = createParamDecorator(
  async (_value: unknown, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const getValidatorClass = (method: string): ClassConstructor<object> => {
      switch (method) {
        case 'LOCK':
        case 'UNLOCK':
        case 'REFRESH_LOCK':
          return LockFileHeader;
        case 'RENAME_FILE':
          return RenameFileHeaders;
        case 'PUT_RELATIVE':
          return PutRelativeFileHeaders;
      }
    };

    const validatorClass = getValidatorClass(headers['x-wopi-override']);

    const dto = plainToInstance(validatorClass, headers, {
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
