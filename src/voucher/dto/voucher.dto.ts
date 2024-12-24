import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

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
  //   message: 'Start date must be at least 1 day in the future',
  // })
  startDate?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate?: string;
}
