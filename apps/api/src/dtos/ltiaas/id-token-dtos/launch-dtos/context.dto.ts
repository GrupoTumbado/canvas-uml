import { IsArray, IsOptional, IsString } from "class-validator";

export class ContextDto {
    @IsString()
    public id: string;

    @IsString()
    public label: string;

    @IsString()
    public title: string;

    @IsArray()
    public type: string[];

    @IsString()
    @IsOptional()
    public validation_context?: string;

    @IsOptional()
    public errors?: Object;
}
