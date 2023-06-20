import { IsArray, IsOptional, IsString } from "class-validator";

export class ResourceDto {
    @IsString()
    public id: string;

    @IsString()
    public title: string;

    @IsArray()
    public description: string[];

    @IsString()
    @IsOptional()
    public validation_context?: string;

    @IsOptional()
    public errors?: Object;
}
