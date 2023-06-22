import { Controller, Get, Param } from "@nestjs/common";
import { CanvasUmlService } from "./canvas-uml.service";

@Controller("uml")
export class CanvasUmlController {
    constructor(private readonly canvasUmlService: CanvasUmlService) {}

    @Get("github-links/:id")
    async getGitHubLink(@Param("id") id: string): Promise<string> {
        return this.canvasUmlService.getGitHubLinkById(id);
    }
}
