import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, Observable } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";
import { ScoreDto } from "../../dtos/ltiaas/score.dto";

@Injectable()
export class LtiaasService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    private readonly logger: Logger = new Logger(LtiaasService.name);

    getAuthHeader(ltik: string): string {
        return `LTIK-AUTH-V1 Token=${ltik}, Additional=Bearer ${this.configService.get("LTIAAS_KEY", "")}`;
    }

    async getIdToken(ltik: string): Promise<IdTokenDto> {
        try {
            const idTokenObservable: Observable<AxiosResponse<IdTokenDto>> = this.httpService.get(
                `https://${this.configService.get("LTIAAS_SUBDOMAIN")}.ltiaas.com/api/idtoken`,
                {
                    headers: { Authorization: this.getAuthHeader(ltik) },
                },
            );

            const idTokenResponse: AxiosResponse<IdTokenDto> = await firstValueFrom(idTokenObservable);
            return idTokenResponse.data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.error, e.response.status);
            } else {
                throw e;
            }
        }
    }

    async submitScore(ltik: string, lineItemId: string, score: ScoreDto): Promise<void> {
        if (!lineItemId) {
            this.logger.error(`Could not find line item ${lineItemId}`);
            throw new HttpException("Could not find line item ID", HttpStatus.BAD_REQUEST);
        }
        lineItemId = encodeURIComponent(lineItemId);

        this.logger.log(`Submitting score for ${score.userId} @ ${lineItemId}`);

        try {
            const scoreObservable: Observable<AxiosResponse<any>> = this.httpService.post(
                `https://${this.configService.get("LTIAAS_SUBDOMAIN")}.ltiaas.com/api/lineitems/${lineItemId}/scores`,
                score,
                {
                    headers: { Authorization: this.getAuthHeader(ltik) },
                },
            );
            await firstValueFrom(scoreObservable);
            this.logger.log(`Successfully submitted score for ${score.userId} @ ${lineItemId}`);
        } catch (e) {
            this.logger.error(e);
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.error, e.response.status);
            } else {
                throw e;
            }
        }
    }
}
