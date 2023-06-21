import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bull";
import { LtiController } from "./lti.controller";
import { LtiService } from "./lti.service";
import { LtiaasModule } from "../ltiaas/ltiaas.module";
import { GitHubModule } from "../github/git-hub.module";

@Module({
    imports: [
        ConfigModule,
        HttpModule,
        BullModule.registerQueue({
            name: "submissions",
        }),
        LtiaasModule,
        GitHubModule,
    ],
    controllers: [LtiController],
    providers: [LtiService],
})
export class LtiModule {}
