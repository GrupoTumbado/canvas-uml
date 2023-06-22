import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema()
export class Submission extends Document {
    @Prop()
    _id: string;

    @Prop()
    url: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
