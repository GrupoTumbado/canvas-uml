import { Controller, Get, Header, Query, Res, StreamableFile } from "@nestjs/common";
import { CanvasUmlService } from "./canvas-uml.service";
import { SvgQueryDto } from "../../dtos/canvas-uml/svg-query.dto";
import { Readable } from "stream";
import { Submission } from "../mongo/schemas/submission.schema";
import type { Response } from "express";

@Controller("uml")
export class CanvasUmlController {
    constructor(private readonly canvasUmlService: CanvasUmlService) {}

    @Get("svg")
    @Header("Content-Type", "image/svg+xml")
    async getSubmissionSvg(@Res({ passthrough: true }) res: Response, @Query() query: SvgQueryDto): Promise<StreamableFile> {
        const submission: Submission = await this.canvasUmlService.getSubmissionById(query.id);

        let filename: string = `attachment; filename="${submission.submissionData.idToken.launch.context.title}_${submission.submissionData.idToken.launch.resource.title}_${submission.submissionData.idToken.user.id}.svg"`;
        filename.replace(" ", "-");
        res.header("Content-Disposition", filename);

        const svgStream: Readable = new Readable();
        svgStream.push(submission.svgData);
        svgStream.push(null);

        return new StreamableFile(svgStream);
    }
}
