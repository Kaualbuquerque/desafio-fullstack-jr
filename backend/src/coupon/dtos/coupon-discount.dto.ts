import { IsString, Length } from 'class-validator';

export class CouponDiscountDto {
  @IsString()
  @Length(3, 50)
  code: string;
}
