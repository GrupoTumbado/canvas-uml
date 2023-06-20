import { IsArray, IsBoolean, IsOptional, IsUrl } from "class-validator";

export class AssignmentAndGradesDto {
    @IsBoolean()
    public available: boolean;

    @IsArray()
    @IsOptional()
    public scopes?: string[];
}
