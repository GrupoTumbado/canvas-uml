import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("lti")
export class LtiController {
    constructor() {}

    @Post("launch")
    async handleLaunchRequest(@Req() req: Request) {
        console.log(req);
    }

    @Post("deeplinking")
    async handleDeepLinkingRequest(@Req() req: Request) {
        console.log(req);
    }
}
