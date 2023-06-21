import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";
import { LtiaasCallbackDto } from "../../dtos/ltiaas/ltiaas-callback.dto";
import { LtiaasService } from "../ltiaas/ltiaas.service";
import { AssignmentSubmissionDto } from "../../dtos/canvas-uml/assignment-submission.dto";
import { GitHubService } from "../github/git-hub.service";

@Injectable()
export class LtiService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly litaasService: LtiaasService,
        private readonly gitHubService: GitHubService,
    ) {}

    async handleLaunchRequest(launch: LtiaasCallbackDto) {
        // TODO: Implementar lógica que permita cambiar lo que ve el usuario en el front para poder manejar más tipos de peticiones (no es necesario para el proyecto)
        return await this.litaasService.getIdToken(launch.ltik);
    }

    async handleDeepLinkingRequest(launch: LtiaasCallbackDto) {
        // TODO: Implementar lógica que permita cambiar lo que ve el usuario en el front para poder manejar más tipos de peticiones (no es necesario para el proyecto)
        return await this.litaasService.getIdToken(launch.ltik);
    }

    async handleAssignmentSubmission(assignmentSubmission: AssignmentSubmissionDto) {
        //const idToken: IdTokenDto = await this.litaasService.getIdToken(assignmentSubmission.ltik);
        const gitHubRepo = await this.gitHubService.verifyRepoUrl(assignmentSubmission.repoUrl);
        const languages = await this.gitHubService.getRepositoryLanguages(gitHubRepo);

        if (!languages.Java) {
            throw new HttpException("Este repositorio no contiene código Java", HttpStatus.BAD_REQUEST);
        }

        const javaBytes = languages.Java;

        for (const languageKey in languages) {
            if (languages[languageKey] > javaBytes) {
                throw new HttpException("Este repositorio no contiene código Java en su mayoría", HttpStatus.BAD_REQUEST);
            }
        }
    }
}
