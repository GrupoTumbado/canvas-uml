import { Module } from "@nestjs/common";
import { LtiController } from "./lti.controller";
import { LtiService } from "./lti.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { LtiaasModule } from "../ltiaas/ltiaas.module";
import { GitHubModule } from "../github/git-hub.module";

@Module({
    imports: [ConfigModule, HttpModule, LtiaasModule, GitHubModule],
    controllers: [LtiController],
    providers: [LtiService],
})
export class LtiModule {}
