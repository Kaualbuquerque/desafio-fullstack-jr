import { IsNumber, Min, Max } from 'class-validator';

export class DiscountPercentDto {
  @IsNumber()
  @Min(0.01)
  @Max(100)
  percent: number;
}
