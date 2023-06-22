import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { SubmissionDataDto } from "../../../dtos/canvas-uml/submission-data.dto";

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema()
export class Submission extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    lineItemId: string;

    @Prop({ required: true })
    submissionData: SubmissionDataDto;

    @Prop({ required: true })
    svgData: string;

    @Prop({ required: true })
    timestamp: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
