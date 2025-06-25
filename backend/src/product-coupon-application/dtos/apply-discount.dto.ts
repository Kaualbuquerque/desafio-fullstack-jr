import { IsEnum, IsNumber, Min } from "class-validator";
import { DiscountType } from "src/utils/discount";

export class ApplyDiscountDto {
  @IsEnum(['percent', 'fixed'], { message: 'Tipo deve ser percent ou fixed' })
  type: DiscountType;

  @IsNumber()
  @Min(0.01)
  value: number;
}
