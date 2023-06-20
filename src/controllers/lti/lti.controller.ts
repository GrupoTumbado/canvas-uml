import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("lti")
export class LtiController {
    constructor() {}

    @Get("launch")
    async handleLaunchRequest(@Query() launch) {
        console.log(launch);
    }

    @Get("deeplinking")
    async handleDeepLinkingRequest(@Query() deeplinking) {
        console.log(deeplinking);
    }
}
