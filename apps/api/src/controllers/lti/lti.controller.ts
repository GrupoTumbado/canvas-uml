import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { LtiService } from "./lti.service";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";

@Controller("lti")
export class LtiController {
    constructor(private readonly ltiService: LtiService) {}

    @Post("launch")
    async handleLaunchRequest(@Body() launch: LtiaasCallbackDto) {
        return this.ltiService.handleLaunchRequest(launch);
    }

    @Post("deeplinking")
    async handleDeepLinkingRequest(@Body() deepLinking: LtiaasCallbackDto) {
        return this.ltiService.handleDeepLinkingRequest(deepLinking);
    }
}
