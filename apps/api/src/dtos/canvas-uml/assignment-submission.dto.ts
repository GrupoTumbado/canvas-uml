import { IsString, IsUrl } from "class-validator";

export class AssignmentSubmissionDto {
    @IsString()
    public ltik: string;

    @IsUrl()
    public repoUrl: string;
}
