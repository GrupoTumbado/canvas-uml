import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Submission } from "../mongo/schemas/submission.schema";
import { MongoService } from "../mongo/mongo.service";

@Injectable()
export class CanvasUmlService {
    constructor(private readonly mongoService: MongoService) {}

    private readonly logger: Logger = new Logger(CanvasUmlService.name);

    async getSubmissionById(id: string): Promise<Submission> {
        const submission: Submission = await this.mongoService.findOneById(id);
        if (!submission) {
            throw new HttpException("La entrega no fue encontrada", HttpStatus.NOT_FOUND);
        }

        return submission;
    }

    async getSvgById(id: string): Promise<string> {
        const submission: Submission = await this.mongoService.findOneById(id);
        if (!submission) {
            throw new HttpException("La imagen no fue encontrada", HttpStatus.NOT_FOUND);
        }

        return submission.svgData;
    }
}
