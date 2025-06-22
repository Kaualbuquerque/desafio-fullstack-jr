import { IsBoolean, IsDateString, IsIn, IsNumber, IsOptional, IsString, Length, Matches, Max, Min, ValidateIf } from "class-validator";

const RESERVED_CODES = ['admin', 'auth', 'null', 'undefined'];

export class CreateCouponDto {
    @IsString()
    @Length(4, 20)
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Apenas caracteres alfanuméricos' })
    code: string;

    @IsIn(['percent', 'fixed'])
    type: 'percent' | 'fixed';

    @IsNumber()
    @ValidateIf(o => o.type === 'percent')
    @Min(1)
    @Max(80)
    // value: number; 

    @ValidateIf(o => o.type === 'fixed')
    @Min(0.01)
    value: number;

    @IsBoolean()
    one_shot: boolean;

    @IsOptional()
    @IsNumber()
    @Min(1)
    max_users?: number;

    @IsDateString()
    valid_from: string;

    @IsDateString()
    valid_until: string;
}