import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LtiModule } from "./modules/lti/lti.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        LtiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../..", "client", "dist"),
            exclude: ["/api/(.*)"],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get("MONGO_URI", ""),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
