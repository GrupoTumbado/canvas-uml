import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { SubmissionsConsumer } from "./submissions.consumer";
import { GitHubModule } from "../github/git-hub.module";
import { CanvasUmlService } from "./canvas-uml.service";
import { CanvasUmlController } from "./canvas-uml.controller";
import { MongoModule } from "../mongo/mongo.module";

@Module({
    imports: [ConfigModule, HttpModule, GitHubModule, MongoModule],
    controllers: [CanvasUmlController],
    providers: [CanvasUmlService, SubmissionsConsumer],
})
export class CanvasUmlModule {}
