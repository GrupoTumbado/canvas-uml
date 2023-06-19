import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LtiModule } from "./controllers/lti/lti.module";

@Module({
    imports: [LtiModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
