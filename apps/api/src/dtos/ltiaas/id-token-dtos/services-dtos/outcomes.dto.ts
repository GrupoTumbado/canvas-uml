import { IsArray, IsBoolean, IsOptional, IsUrl } from "class-validator";

export class OutcomesDto {
    @IsBoolean()
    public available: boolean;

    @IsUrl()
    @IsOptional()
    public lineItemId?: string;

    @IsArray()
    @IsOptional()
    public scopes?: string[];
}
