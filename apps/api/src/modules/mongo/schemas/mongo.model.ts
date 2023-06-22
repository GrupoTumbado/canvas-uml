import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Link extends Document {
    @Prop()
    _id: string;

    @Prop()
    url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
