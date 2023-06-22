import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bull";
import { LtiModule } from "./modules/lti/lti.module";
import { CanvasUmlModule } from "./modules/canvas-uml/canvas-uml.module";

@Module({
    imports: [
        CanvasUmlModule,
        LtiModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "client"),
            exclude: ["/api/(.*)"],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get("MONGO_URI"),
                dbName: configService.get("MONGO_DB"),
            }),
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get("REDIS_HOST"),
                    port: configService.get("REDIS_PORT"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
