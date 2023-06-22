import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SubmissionsConsumer } from "./submissions.consumer";
import { GitHubModule } from "../github/git-hub.module";
import { CanvasUmlService } from "./canvas-uml.service";

@Module({
    imports: [ConfigModule, GitHubModule],
    providers: [CanvasUmlService, SubmissionsConsumer],
})
export class CanvasUmlModule {}
