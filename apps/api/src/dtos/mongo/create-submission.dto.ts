import { SubmissionDataDto } from "../canvas-uml/submission-data.dto";

export class CreateSubmissionDto {
    public userId: string;
    public lineItemId: string;
    public submissionData: SubmissionDataDto;
    public svgData: string;
    public timestamp: number;
}
