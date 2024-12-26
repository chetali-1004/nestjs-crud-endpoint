import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
  MinDate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: string, args: ValidationArguments) {
    const startDate = args.object['startDate'];
    return new Date(endDate) > new Date(startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'End date must be after start date';
  }
}

export function IsEndDateAfterStartDate(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEndDateAfterStartDateConstraint,
    });
  };
}

export class VoucherDto {
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Discount must be greater than 0' })
  @Max(100, { message: 'Discount must be less than or equal to 100' })
  discount: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  // @MinDate(() => new Date(Date.now()), {
  //   message: 'Start date must not be in the past',
  // })
  startDate?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  // @MinDate(() => new Date(Date.now()), {
  //   message: 'End date must not be in the past',
  // })
  @IsEndDateAfterStartDate({ message: 'End date must be after the start date' })
  endDate?: string;
}
