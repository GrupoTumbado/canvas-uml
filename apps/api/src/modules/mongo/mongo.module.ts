import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Link, LinkSchema } from "./schemas/mongo.model";
import { MongoController } from "./mongo.controller";
import { MongoService } from "./mongo.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }])],
    controllers: [MongoController],
    providers: [MongoService],
})
export class LtiModule {}
