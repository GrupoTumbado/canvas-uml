import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { ContentItemDto } from "./content-item.dto";
import { SubmissionTypeEnum } from "./enums/submission-type.enum";

export class ExtensionDto {
    @IsBoolean()
    @IsOptional()
    new_submission?: boolean;

    @IsBoolean()
    @IsOptional()
    prioritize_non_tool_grade?: boolean;

    @IsString()
    @IsOptional()
    submission_type?: SubmissionTypeEnum;

    @IsString()
    @IsOptional()
    submission_data?: string;

    @IsString()
    @IsOptional()
    submitted_at?: string;

    @IsArray()
    @IsOptional()
    content_items?: ContentItemDto[];
}
