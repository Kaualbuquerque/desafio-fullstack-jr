import { IsIn, IsNumber, Min } from 'class-validator';

export class ApplyDiscountDto {
  @IsIn(['percent', 'fixed'])
  type: 'percent' | 'fixed';

  @IsNumber()
  @Min(0.01)
  value: number;
}
