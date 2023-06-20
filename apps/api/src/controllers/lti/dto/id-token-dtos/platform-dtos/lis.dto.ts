import { IsOptional, IsString } from "class-validator";

export class LisDto {
    @IsString()
    @IsOptional()
    public course_offering_sourcedid?: string;

    @IsString()
    @IsOptional()
    public person_sourcedid?: string;

    @IsString()
    @IsOptional()
    public validation_context?: string;

    @IsOptional()
    public errors?: Object;
}
