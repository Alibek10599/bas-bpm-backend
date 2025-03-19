// Custom validation for Record<string, string | number>
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'RecordStringToStringOrNumber', async: false })
export class IsRecordStringToStrOrNum implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null) return false;

    return Object.entries(value).every(
      ([key, val]) =>
        typeof key === 'string' &&
        (typeof val === 'string' || typeof val === 'number'),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `variables must be a record where keys are strings and values are strings or numbers`;
  }
}
