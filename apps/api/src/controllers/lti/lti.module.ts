import { Module } from "@nestjs/common";
import { LtiController } from "./lti.controller";
import { LtiService } from "./lti.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule, HttpModule],
    controllers: [LtiController],
    providers: [LtiService],
})
export class LtiModule {}
