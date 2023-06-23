import { Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map, Observable } from "rxjs";
import { AxiosResponse } from "axios";
import * as FormData from "form-data";
import { SubmissionDataDto } from "../../dtos/canvas-uml/submission-data.dto";
import { GitHubService } from "../github/git-hub.service";
import { ScoreDto } from "../../dtos/ltiaas/score.dto";
import { ActivityProgressEnum } from "../ltiaas/enums/activity-progress.enum";
import { GradingProgressEnum } from "../ltiaas/enums/grading-progress.enum";
import { LtiaasService } from "../ltiaas/ltiaas.service";
import { UploadInfoDto } from "../../dtos/canvas-uml/upload-info.dto";
import { MongoService } from "../mongo/mongo.service";
import { SubmissionTypeEnum } from "../../dtos/ltiaas/score-dtos/enums/submission-type.enum";

@Processor("submissions")
export class SubmissionsConsumer {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly gitHubService: GitHubService,
        private readonly mongoService: MongoService,
        private readonly ltiaasService: LtiaasService,
    ) {}

    private readonly logger: Logger = new Logger(SubmissionsConsumer.name);

    async saveSvgToMongo(svgData: string, submissionJob: SubmissionDataDto): Promise<void> {
        this.logger.log(
            `Saving submission from ${submissionJob.idToken.user.name} (${submissionJob.idToken.user.id}) @ ${submissionJob.idToken.launch.resource.title} (${submissionJob.idToken.launch.context.title})`,
        );

        const submission = await this.mongoService.create({
            userId: submissionJob.idToken.user.id,
            lineItemId: submissionJob.idToken.launch.lineItemId,
            submissionData: submissionJob,
            svgData: svgData,
            timestamp: Date.now(),
        });

        this.logger.log(
            `Submission from ${submissionJob.idToken.user.name} (${submissionJob.idToken.user.id}) @ ${submissionJob.idToken.launch.resource.title} (${submissionJob.idToken.launch.context.title}) saved with ID ${submission._id}`,
        );

        const curDate: Date = new Date();
        const score: ScoreDto = {
            userId: submission.submissionData.idToken.user.id,
            activityProgress: ActivityProgressEnum.Submitted,
            gradingProgress: GradingProgressEnum.PendingManual,
            comment: `Repo de GitHub - ${submissionJob.gitHubRepo.url}`,
            "https://canvas.instructure.com/lti/submission": {
                submission_type: SubmissionTypeEnum.OnlineUpload,
                submitted_at: curDate.toISOString(),
                content_items: [
                    /*{
                        type: "file",
                        url: submissionJob.gitHubRepo.url,
                        title: "Repo de GitHub",
                    },*/
                    {
                        type: "file",
                        url: `https://javatouml.espana.pw/api/uml/svg?id=${submission._id}`,
                        title: "Diagrama de Código",
                    },
                ],
            },
        };

        await this.ltiaasService.submitScore(submission.submissionData.ltik, submission.submissionData.idToken.launch.lineItemId, score);
    }

    subscribeToSvgEvent(submissionJob: SubmissionDataDto): void {
        try {
            this.httpService.axiosRef
                .get(`http://192.168.1.15:3001/api/event/uml/svg/${submissionJob.javaToUmlId}`, {
                    responseType: "stream",
                    timeout: 0,
                })
                .then((response: AxiosResponse): void => {
                    response.data.on("data", (chunk: Buffer): void => {
                        const eventData: string = chunk.toString();
                        if (eventData === `event: "SUCCEEDED"`) {
                            this.generateAndSaveSvg(submissionJob);
                        }
                    });

                    response.data.on("error", (error: Error): void => {
                        // Handle errors that occur during the SSE connection
                        this.logger.error(`SSE svg connection error: ${error}`);
                    });
                });
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    async generateAndSaveSvg(submissionJob: SubmissionDataDto): Promise<void> {
        const svgObservable: Observable<AxiosResponse<any>> = this.httpService.get(
            `http://192.168.1.15:3001/api/uml/svg/${submissionJob.javaToUmlId}`,
        );

        return await svgObservable
            .pipe(
                map((response: AxiosResponse<any>): void => {
                    switch (response.headers["content-type"]) {
                        case "application/json":
                        case "application/json+hal":
                            try {
                                const data = response.data;
                                this.logger.log(response.data);
                                if (data && data.status && data.status === "ACCEPTED") {
                                    this.logger.log(
                                        `SVG for ${submissionJob.idToken.user.name} (${submissionJob.idToken.user.id}) @ ${submissionJob.idToken.launch.resource.title} (${submissionJob.idToken.launch.context.title}) is not ready, subscribing to SSE`,
                                    );
                                    this.subscribeToSvgEvent(submissionJob);
                                } else {
                                    const score: ScoreDto = {
                                        userId: submissionJob.idToken.user.id,
                                        activityProgress: ActivityProgressEnum.Initialized,
                                        gradingProgress: GradingProgressEnum.Failed,
                                    };
                                    this.ltiaasService.submitScore(submissionJob.ltik, submissionJob.idToken.launch.lineItemId, score);
                                }
                            } catch (e) {
                                this.logger.error(e);
                                throw e;
                            }
                            break;
                        case "image/svg+xml":
                            this.saveSvgToMongo(response.data, submissionJob);
                            break;
                        default:
                            break;
                    }
                }),
            )
            .toPromise();
    }

    async uploadZipToJ2U(zip: FormData): Promise<UploadInfoDto> {
        try {
            const zipUploadObservable: Observable<AxiosResponse<any>> = await this.httpService.post(
                `http://192.168.1.15:3001/api/files`,
                zip,
                {
                    headers: {
                        ...zip.getHeaders(),
                        "Content-Length": zip.getLengthSync(),
                    },
                },
            );

            const zipUploadResponse: AxiosResponse<UploadInfoDto> = await firstValueFrom(zipUploadObservable);
            return zipUploadResponse.data;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Process()
    async processSubmission(job: Job<SubmissionDataDto>): Promise<void> {
        try {
            this.logger.log(
                `Processing submission from ${job.data.idToken.user.name} (${job.data.idToken.user.id}) @ ${job.data.idToken.launch.resource.title} (${job.data.idToken.launch.context.title})`,
            );
            const zip: Buffer = await this.gitHubService.getRepositoryZip(job.data.gitHubRepo);
            const formData: FormData = new FormData();
            formData.append("file", zip, { filename: `${job.data.gitHubRepo.owner}-${job.data.gitHubRepo.repo}.zip` });

            const zipUploadInfo: UploadInfoDto = await this.uploadZipToJ2U(formData);
            const submissionJob: SubmissionDataDto = job.data;
            submissionJob.javaToUmlId = zipUploadInfo.id;

            this.generateAndSaveSvg(submissionJob);
        } catch (e) {
            const score: ScoreDto = {
                userId: job.data.idToken.user.id,
                activityProgress: ActivityProgressEnum.Initialized,
                gradingProgress: GradingProgressEnum.Failed,
            };
            this.ltiaasService.submitScore(job.data.ltik, job.data.idToken.launch.lineItemId, score);
        }
    }
}
