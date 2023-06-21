import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { LtiaasService } from "./ltiaas.service";

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [LtiaasService],
    exports: [LtiaasService],
})
export class LtiaasModule {}
