import { IsNumber, IsOptional, IsString } from "class-validator";
import { SubmissionDto } from "./score-dtos/submission.dto";
import { ActivityProgressEnum } from "../../modules/ltiaas/enums/activity-progress.enum";
import { GradingProgressEnum } from "../../modules/ltiaas/enums/grading-progress.enum";

export class ScoreDto {
    @IsString()
    public userId: string;

    @IsString()
    public activityProgress: ActivityProgressEnum;

    @IsString()
    public gradingProgress: GradingProgressEnum;

    @IsNumber()
    @IsOptional()
    public scoreGiven?: number;

    @IsNumber()
    @IsOptional()
    public scoreMaximum?: number;

    @IsString()
    @IsOptional()
    public comment?: string;

    @IsOptional()
    public submission?: SubmissionDto;

    @IsString()
    @IsOptional()
    public timestamp?: string;
}
