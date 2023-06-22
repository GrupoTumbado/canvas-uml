import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Submission } from "./schemas/submission.schema";

@Injectable()
export class MongoService {
    constructor(@InjectModel(Submission.name) private readonly linkModel: Model<Submission>) {}

    async getGitHubLinkById(id: string): Promise<string> {
        const link: Submission = await this.linkModel.findById(id).exec();

        if (!link) {
            throw new HttpException("El enlace no fue encontrado", HttpStatus.NOT_FOUND);
        }

        return link.url;
    }
}
