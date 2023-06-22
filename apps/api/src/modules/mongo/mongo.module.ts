import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Submission, SubmissionSchema } from "./schemas/submission.schema";
import { MongoService } from "./mongo.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])],
    providers: [MongoService],
    exports: [MongoService],
})
export class MongoModule {}
