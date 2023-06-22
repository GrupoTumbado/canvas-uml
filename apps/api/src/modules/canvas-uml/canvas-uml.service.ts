import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Submission } from "../mongo/schemas/submission.schema";
import { MongoService } from "../mongo/mongo.service";

@Injectable()
export class CanvasUmlService {
    constructor(private readonly mongoService: MongoService) {}

    async getGitHubLinkById(id: string): Promise<string> {
        const submission: Submission = await this.mongoService.findOne(id);

        if (!submission) {
            throw new HttpException("El enlace no fue encontrado", HttpStatus.NOT_FOUND);
        }

        return submission.url;
    }
}
