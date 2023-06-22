import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Submission } from "./schemas/submission.schema";
import { CreateSubmissionDto } from "../../dtos/mongo/create-submission.dto";

@Injectable()
export class MongoService {
    constructor(@InjectModel(Submission.name) private readonly submissionModel: Model<Submission>) {}

    async create(createSubmission: CreateSubmissionDto): Promise<Submission> {
        return await this.submissionModel.create(createSubmission);
    }

    async findAll(): Promise<Submission[]> {
        return this.submissionModel.find().exec();
    }

    async findOne(id: string): Promise<Submission> {
        return this.submissionModel.findOne({ _id: id }).exec();
    }

    async delete(id: string) {
        return this.submissionModel.findByIdAndRemove({ _id: id }).exec();
    }
}
