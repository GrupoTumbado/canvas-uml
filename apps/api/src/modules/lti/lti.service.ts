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
    private client: MongoClient;
    private db: Db;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly litaasService: LtiaasService,
    ) {
        const uri = "mongodb+srv://admin:btdyw7rgG6mpYCft@cluster0.4twbbsi.mongodb.net/?retryWrites=true&w=majority";
        this.client = new MongoClient(uri, {
            serverApi: {
                version: "1",
            },
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db("GitHubLinks");
            console.log("Conexión a la base de datos establecida");
        } catch (error) {
            console.error("Error al conectar a la base de datos:", error);
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.close();
            console.log("Desconexión de la base de datos exitosa");
        } catch (error) {
            console.error("Error al desconectar de la base de datos:", error);
        }
    }

    async getRepositoryUrls(): Promise<string[]> {
        try {
            const collection = this.db.collection("GitHubLinks");
            const result = await collection.find().toArray();
            const urls = result.map((item) => item.url);
            return urls;
        } catch (error) {
            console.error("Error al obtener los URLs de GitHub:", error);
            return [];
        }
    }

    async handleLaunchRequest(launch: LtiaasCallbackDto) {
        return await this.litaasService.getIdToken(launch.ltik);
    }

    async handleDeepLinkingRequest(launch: LtiaasCallbackDto) {
        return await this.litaasService.getIdToken(launch.ltik);
    }
}
