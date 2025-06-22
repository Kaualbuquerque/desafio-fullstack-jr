import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListProductDto {
    @Type(() => Number)
    @IsInt() @Min(1)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsInt() @Min(1) @Max(50)
    @IsOptional()
    limit?: number = 10;

    @IsOptional() @IsString()
    search?: string;

    @Type(() => Number)
    @IsOptional() @Min(0)
    minPrice?: number;

    @Type(() => Number)
    @IsOptional() @Min(0)
    maxPrice?: number;

    @Type(() => Boolean)
    @IsOptional() @IsBoolean()
    hasDiscount?: boolean;

    @IsOptional() @IsString()
    sortBy?: 'name' | 'price' | 'created_at' | 'stock';

    @IsOptional() @IsString()
    sortOrder?: 'asc' | 'desc';

    @Type(() => Boolean)
    @IsOptional() @IsBoolean()
    onlyOutOfStock?: boolean;

    @Type(() => Boolean)
    @IsOptional() @IsBoolean()
    withCouponApplied?: boolean;
}