import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { LtiService } from "./lti.service";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";
import { AssignmentSubmissionDto } from "../../dtos/canvas-uml/assignment-submission.dto";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";

@Controller("lti")
export class LtiController {
    constructor(private readonly ltiService: LtiService) {}

    @Post("launch")
    async handleLaunchRequest(@Body() launch: LtiaasCallbackDto): Promise<IdTokenDto> {
        return this.ltiService.handleLaunchRequest(launch);
    }

    @Post("deeplinking")
    async handleDeepLinkingRequest(@Body() deepLinking: LtiaasCallbackDto): Promise<IdTokenDto> {
        return this.ltiService.handleDeepLinkingRequest(deepLinking);
    }

    @Post("submit-assignment")
    async handleAssignmentSubmission(@Body() assignmentSubmission: AssignmentSubmissionDto): Promise<void> {
        return this.ltiService.handleAssignmentSubmission(assignmentSubmission);
    }

    @Get("github-links")
    async getGitHubLinks() {
        /*await this.ltiService.connect();
        const urls = await this.ltiService.getRepositoryUrls();
        await this.ltiService.disconnect();
        console.log('URLs de GitHub:', urls);
        return urls;*/
    }
}
