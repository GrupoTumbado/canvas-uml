import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { GitHubService } from "./git-hub.service";

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [GitHubService],
    exports: [GitHubService],
})
export class GitHubModule {}
