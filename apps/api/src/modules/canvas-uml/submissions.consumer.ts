import { HttpException, Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { filter, firstValueFrom, map, Observable, reduce, tap } from "rxjs";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as FormData from "form-data";
import { SubmissionDataDto } from "../../dtos/canvas-uml/submission-data.dto";
import { GitHubService } from "../github/git-hub.service";
import { ScoreDto } from "../../dtos/ltiaas/score.dto";
import { ActivityProgressEnum } from "../ltiaas/enums/activity-progress.enum";
import { GradingProgressEnum } from "../ltiaas/enums/grading-progress.enum";
import { LtiaasService } from "../ltiaas/ltiaas.service";
import { UploadInfoDto } from "../../dtos/canvas-uml/upload-info.dto";
import { GitHubRepoDto } from "../../dtos/github/git-hub-repo.dto";
import * as fs from "fs";

@Processor("submissions")
export class SubmissionsConsumer {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly gitHubService: GitHubService,
    ) {}

    private readonly logger: Logger = new Logger(SubmissionsConsumer.name);

    saveSvgToMongo(svgData: string, submissionJob: SubmissionDataDto): void {
        //this.logger.log(`Saving submission - ${submissionJob.gitHubRepo.owner}/${submissionJob.gitHubRepo.repo}`);
        this.logger.log(
            `Saving submission from ${submissionJob.idToken.user.name} (${submissionJob.idToken.user.id}) @ ${submissionJob.idToken.launch.context.title} (${submissionJob.idToken.launch.resource.title})`,
        );

        /*const score: ScoreDto = {
            userId: job.data.idToken.user.id,
            activityProgress: ActivityProgressEnum.Submitted,
            gradingProgress: GradingProgressEnum.Pending,
        };

        await this.ltiaasService.submitScore(job.data.ltik, job.data.idToken.launch.lineItemId, score);*/
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
                                //const data = JSON.parse(response.data);
                                const data = response.data;
                                this.logger.log(response.data);
                                if (data && data.status && data.status === "ACCEPTED") {
                                    /*this.logger.log(
                                        `SVG for ${submissionJob.gitHubRepo.owner}/${submissionJob.gitHubRepo.repo} is not ready, subscribing to SSE`,
                                    );*/
                                    this.logger.log(
                                        `SVG for ${submissionJob.idToken.user.name} (${submissionJob.idToken.user.id}) @ ${submissionJob.idToken.launch.context.title} (${submissionJob.idToken.launch.resource.title}) is not ready, subscribing to SSE`,
                                    );
                                    this.subscribeToSvgEvent(submissionJob);
                                } else {
                                    // Something broke. We should probably do something?
                                    // Maybe send the error to Canvas, or mark the submission as pending
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
        //this.logger.log(`Processing submission - ${job.data.gitHubRepo.owner}/${job.data.gitHubRepo.repo}`);
        this.logger.log(
            `Processing submission from ${job.data.idToken.user.name} (${job.data.idToken.user.id}) @ ${job.data.idToken.launch.context.title} (${job.data.idToken.launch.resource.title})`,
        );
        const zip: Buffer = await this.gitHubService.getRepositoryZip(job.data.gitHubRepo);
        const formData: FormData = new FormData();
        formData.append("file", zip, { filename: `${job.data.gitHubRepo.owner}-${job.data.gitHubRepo.repo}.zip` });

        const zipUploadInfo: UploadInfoDto = await this.uploadZipToJ2U(formData);
        const submissionJob: SubmissionDataDto = job.data;
        submissionJob.javaToUmlId = zipUploadInfo.id;

        this.generateAndSaveSvg(submissionJob);
    }
}
