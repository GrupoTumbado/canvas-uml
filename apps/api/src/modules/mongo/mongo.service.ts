import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Submission } from "./schemas/submission.schema";
import { CreateSubmissionDto } from "../../dtos/mongo/create-submission.dto";

@Injectable()
export class MongoService {
    constructor(@InjectModel(Submission.name) private readonly submissionModel: Model<Submission>) {}

    private readonly logger: Logger = new Logger(MongoService.name);

    async create(createSubmission: CreateSubmissionDto): Promise<Submission> {
        return await this.submissionModel.create(createSubmission);
    }

    async findAll(): Promise<Submission[]> {
        return this.submissionModel.find().exec();
    }

    async findMostRecentById(_id: string): Promise<Submission> {
        return this.submissionModel.findOne({ _id }).sort({ timestamp: -1 }).exec();
    }

    async findMostRecentByUserAndLineItem(userId: string, lineItemId: string): Promise<Submission> {
        return this.submissionModel.findOne({ userId, lineItemId }).sort({ timestamp: -1 }).exec();
    }

    async findOneById(_id: string): Promise<Submission> {
        return this.submissionModel.findOne({ _id }).exec();
    }

    async findOneByUserAndLineItem(userId: string, lineItemId: string): Promise<Submission> {
        return this.submissionModel.findOne({ userId, lineItemId }).exec();
    }

    async delete(_id: string) {
        return this.submissionModel.findByIdAndRemove({ _id }).exec();
    }

    async deleteByUserAndLineItem(userId: string, lineItemId: string) {
        return this.submissionModel.findByIdAndRemove({ userId, lineItemId }).exec();
    }
}
