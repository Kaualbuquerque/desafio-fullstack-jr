import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";

const regexName = /^[a-zA-Z0-9\\s\\-_,.]+$/;

export class CreateProductDto {
    @IsString()
    @Matches(regexName)
    @Length(3, 100)
    name: string;

    @IsOptional()
    @IsString()
    @Length(0, 300)
    description?: string;

    @IsInt()
    @Min(0)
    @Max(999999)
    stock: number;

    @Transform(({ value }) => {
        // aceita "1.234,56" ou 1234.56
        if (typeof value === 'string') {
            const normalized = value.replace(/\./g, '').replace(',', '.');
            return parseFloat(normalized);
        }
        return value;
    })
    @Min(0.01)
    @Max(1000000)
    price: number;

    @IsString()
    @Length(3, 100)
    category: string;
}