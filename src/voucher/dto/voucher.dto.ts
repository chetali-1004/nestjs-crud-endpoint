import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsIn,
  IsArray,
} from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/validator/is-end-date-after-start-date.validator';
import { IsFutureDate } from 'src/validator/is-future-date.validator';

export class VoucherDto {
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsIn(['percentage', 'fixed', 'free_shipping'], {
    message: "Type must be one of 'percentage', 'fixed', or 'free_shipping'",
  })
  type: 'percentage' | 'fixed' | 'free_shipping';

  @IsIn(['product', 'shipping', 'cart'], {
    message: "Target must be one of 'product', 'shipping', or 'cart'",
  })
  target: 'product' | 'shipping' | 'cart';

  applicableProducts?: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Discount must be greater than 0' })
  @Max(100, { message: 'Discount must be less than or equal to 100' })
  discount?: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  @IsFutureDate({ message: 'Start date must be in the future' })
  startDate?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  @IsEndDateAfterStartDate({ message: 'End date must be after the start date' })
  endDate?: string;
}
