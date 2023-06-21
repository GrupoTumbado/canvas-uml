import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, map, Observable } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";

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

        try {
            const idTokenObservable: Observable<AxiosResponse<IdTokenDto>> = this.httpService.get(
                `https://${this.configService.get("LTIAAS_SUBDOMAIN", "")}.ltiaas.com/api/idtoken`,
                {
                    headers: { Authorization: authHeader },
                },
            );

            const idTokenResponse: AxiosResponse<IdTokenDto> = await firstValueFrom(idTokenObservable);

            const idToken: IdTokenDto = idTokenResponse.data;
            return idToken;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
            } else {
                throw e;
            }
        }
    }
}
