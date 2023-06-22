import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ConfigService } from "@nestjs/config";
import { SubmissionJobDto } from "../../dtos/canvas-uml/submission-job.dto";
import { GitHubService } from "../github/git-hub.service";
import { ScoreDto } from "../../dtos/ltiaas/score.dto";
import { ActivityProgressEnum } from "../ltiaas/enums/activity-progress.enum";
import { GradingProgressEnum } from "../ltiaas/enums/grading-progress.enum";
import { LtiaasService } from "../ltiaas/ltiaas.service";

@Processor("submissions")
export class SubmissionsConsumer {
    constructor(private readonly gitHubService: GitHubService, private readonly configService: ConfigService) {}

    @Process()
    async processSubmission(job: Job<SubmissionJobDto>) {
        console.log("Processing job");
        const zip: Blob = await this.gitHubService.getRepositoryZip(job.data.gitHubRepo);

        /*const score: ScoreDto = {
            userId: job.data.idToken.user.id,
            activityProgress: ActivityProgressEnum.Submitted,
            gradingProgress: GradingProgressEnum.Pending,
        };

        await this.ltiaasService.submitScore(job.data.ltik, job.data.idToken.launch.lineItemId, score);*/
    }
}
