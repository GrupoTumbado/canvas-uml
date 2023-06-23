import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";
import { LtiaasService } from "../ltiaas/ltiaas.service";
import { AssignmentSubmissionDto } from "../../dtos/canvas-uml/assignment-submission.dto";
import { GitHubService } from "../github/git-hub.service";
import { SubmissionDataDto } from "../../dtos/canvas-uml/submission-data.dto";
import { ScoreDto } from "../../dtos/ltiaas/score.dto";
import { GitHubRepoDto } from "../../dtos/github/git-hub-repo.dto";
import { LanguagesDto } from "../../dtos/github/languages.dto";
import { ActivityProgressEnum } from "../ltiaas/enums/activity-progress.enum";
import { GradingProgressEnum } from "../ltiaas/enums/grading-progress.enum";

@Injectable()
export class LtiService {
    constructor(
        @InjectQueue("submissions") private submissionsQueue: Queue,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly ltiaasService: LtiaasService,
        private readonly gitHubService: GitHubService,
    ) {}

    private readonly logger: Logger = new Logger(LtiService.name);

    async handleLaunchRequest(launch: LtiaasCallbackDto): Promise<IdTokenDto> {
        // TODO: Implementar lógica que permita cambiar lo que ve el usuario en el front para poder manejar más tipos de peticiones (no es necesario para el proyecto)
        return await this.ltiaasService.getIdToken(launch.ltik);
    }

    async handleDeepLinkingRequest(launch: LtiaasCallbackDto): Promise<IdTokenDto> {
        // TODO: Implementar lógica que permita cambiar lo que ve el usuario en el front para poder manejar más tipos de peticiones (no es necesario para el proyecto)
        return await this.ltiaasService.getIdToken(launch.ltik);
    }

    async handleAssignmentSubmission(assignmentSubmission: AssignmentSubmissionDto): Promise<void> {
        const idToken: IdTokenDto = await this.ltiaasService.getIdToken(assignmentSubmission.ltik);
        const gitHubRepo: GitHubRepoDto = await this.gitHubService.verifyRepoUrl(assignmentSubmission.repoUrl);
        const languages: LanguagesDto = await this.gitHubService.getRepositoryLanguages(gitHubRepo);

        if (!languages.Java) {
            throw new HttpException("Este repositorio no contiene código Java", HttpStatus.BAD_REQUEST);
        }

        const javaBytes: number = languages.Java;

        for (const languageKey in languages) {
            if (languages[languageKey] > javaBytes) {
                throw new HttpException("Este repositorio no contiene código Java en su mayoría", HttpStatus.BAD_REQUEST);
            }
        }

        const score: ScoreDto = {
            userId: idToken.user.id,
            activityProgress: ActivityProgressEnum.Initialized,
            gradingProgress: GradingProgressEnum.NotReady,
        };
        await this.ltiaasService.submitScore(assignmentSubmission.ltik, idToken.launch.lineItemId, score);

        const submissionJob: SubmissionDataDto = {
            ltik: assignmentSubmission.ltik,
            idToken: idToken,
            gitHubRepo: gitHubRepo,
        };
        this.submissionsQueue.add(submissionJob);
    }
}
