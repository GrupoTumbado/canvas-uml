import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LtiModule } from "./modules/lti/lti.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
    imports: [
        LtiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../..", "client", "dist"),
            exclude: ["/api/(.*)"],
        }),
    ],
})
export class AppModule {}
