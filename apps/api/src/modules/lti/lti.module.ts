import { Module } from "@nestjs/common";
import { LtiController } from "./lti.controller";
import { LtiService } from "./lti.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { LtiaasModule } from "../ltiaas/lti.module";

@Module({
    imports: [ConfigModule, HttpModule, LtiaasModule],
    controllers: [LtiController],
    providers: [LtiService],
})
export class LtiModule {}
