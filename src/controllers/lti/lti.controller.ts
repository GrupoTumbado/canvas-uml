import { Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("lti")
export class LtiController {
    constructor() {}

    @Get("launch")
    async handleLaunchRequest(@Req() req: Request) {
        console.log(req);
    }

    @Get("deeplinking")
    async handleDeepLinkingRequest(@Req() req: Request) {
        console.log(req);
    }
}
