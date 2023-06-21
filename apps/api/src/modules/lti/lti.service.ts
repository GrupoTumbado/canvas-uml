import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, map, Observable } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";
import { LtiaasService } from "../ltiaas/ltiaas.service";

@Injectable()
export class LtiService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly litaasService: LtiaasService,
    ) {}

    async handleLaunchRequest(launch: LtiaasCallbackDto) {
        return await this.litaasService.getIdToken(launch.ltik);
    }

    async handleDeepLinkingRequest(launch: LtiaasCallbackDto) {
        return await this.litaasService.getIdToken(launch.ltik);
    }
}
