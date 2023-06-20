import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LtiModule } from "./controllers/lti/lti.module";

@Module({
    imports: [LtiModule, ConfigModule.forRoot({ isGlobal: true, cache: true })],
})
export class AppModule {}
