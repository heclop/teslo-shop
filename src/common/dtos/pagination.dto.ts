import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    // Tranformar
    @Type( () => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    // Tranformar
    @Type( () => Number)
    offset?: number;
}