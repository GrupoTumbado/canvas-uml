import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Submission } from "../mongo/schemas/submission.schema";
import { MongoService } from "../mongo/mongo.service";

@Injectable()
export class CanvasUmlService {
    constructor(private readonly mongoService: MongoService) {}

    private readonly logger: Logger = new Logger(CanvasUmlService.name);

    async getGitHubLinkById(id: string): Promise<string> {
        const submission: Submission = await this.mongoService.findOne(id);

        if (!submission) {
            throw new HttpException("El enlace no fue encontrado", HttpStatus.NOT_FOUND);
        }

        return submission.url;
    }
}
