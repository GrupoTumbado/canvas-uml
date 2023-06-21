import { IsOptional, IsString } from "class-validator";

export class SubmissionDto {
    @IsString()
    @IsOptional()
    public startedAt?: string;

    @IsString()
    @IsOptional()
    public submittedAt?: string;
}
