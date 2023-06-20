import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, map, Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { IdTokenDto } from "./dto/id-token.dto";
import { LtiaasCallbackDto } from "./dto/ltiaas-callback.dto";

@Injectable()
export class LtiService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    async handleLaunchRequest(launch: LtiaasCallbackDto) {
        return await this.getIdToken(launch.ltik);
    }

    async handleDeepLinkingRequest(launch: LtiaasCallbackDto) {
        return await this.getIdToken(launch.ltik);
    }

    async getIdToken(ltik: string) {
        const authHeader: string = `LTIK-AUTH-V1 Token=${ltik}, Additional=Bearer ${this.configService.get(
            "LTIAAS_KEY",
            "",
        )}`;

        const idTokenResponse: AxiosResponse<IdTokenDto> = await firstValueFrom(
            this.httpService.get(`https://${this.configService.get("LTIAAS_SUBDOMAIN", "")}.ltiaas.com/api/idtoken`, {
                headers: { Authorization: authHeader },
            }),
        );

        const idToken: IdTokenDto = idTokenResponse.data;
        console.log(idToken);
        return idToken;
    }
}
