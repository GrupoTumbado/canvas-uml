import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { LtiService } from "./lti.service";
import { LtiaasCallbackDto } from "./dto/ltiaas-callback.dto";

@Controller("lti")
export class LtiController {
    constructor(private readonly ltiService: LtiService) {}

    @Get("launch")
    async handleLaunchRequest(@Query() launch: LtiaasCallbackDto) {
        return this.ltiService.handleLaunchRequest(launch);
    }

    @Get("deeplinking")
    async handleDeepLinkingRequest(@Query() deepLinking: LtiaasCallbackDto) {
        return this.ltiService.handleDeepLinkingRequest(deepLinking);
    }
}
