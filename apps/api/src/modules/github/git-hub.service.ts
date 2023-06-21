import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, Observable } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { GitHubRepoDto } from "../../dtos/github/git-hub-repo.dto";
import { LanguagesDto } from "../../dtos/github/languages.dto";
import { IdTokenDto } from "../../dtos/ltiaas/id-token.dto";

@Injectable()
export class GitHubService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    getAuthHeader(): string {
        return `Bearer ${this.configService.get("GITHUB_TOKEN")}`;
    }

    async verifyRepoUrl(url: string): Promise<GitHubRepoDto> {
        const testPattern: RegExp =
            /(?:git|https?|git@)(?::\/\/)?github.com[/|:][\w-]+?\/[\w.-]+\/?(?!=.git)(?:\.git(?:\/?|#[\w.\-_]+)?)?$/gi;
        const gitHubUrl: GitHubRepoDto = { isGitHubRepo: testPattern.test(url), url: url };
        if (!gitHubUrl.isGitHubRepo) return gitHubUrl;

        const extractPattern: RegExp = /(?:git|https?|git@)(?::\/\/)?github.com[/|:]([\w-]+?)\/([\w-]+)/gi;
        const matches = extractPattern.exec(url);
        gitHubUrl.owner = matches[1];
        gitHubUrl.repo = matches[2];

        try {
            const repoObservable: Observable<AxiosResponse<any>> = this.httpService.get(
                `${this.configService.get("GITHUB_URL", "https://api.github.com")}/repos/${gitHubUrl.owner}/${gitHubUrl.repo}`,
                {
                    headers: { Authorization: this.getAuthHeader(), Accept: "application/vnd.github+json" },
                },
            );

            await firstValueFrom(repoObservable);
            return gitHubUrl;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.message, e.response.status);
            } else {
                throw e;
            }
        }
    }

    async getRepositoryLanguages(gitHubRepo: GitHubRepoDto): Promise<LanguagesDto> {
        try {
            const languagesObservable: Observable<AxiosResponse<LanguagesDto>> = this.httpService.get(
                `${this.configService.get("GITHUB_URL", "https://api.github.com")}/repos/${gitHubRepo.owner}/${gitHubRepo.repo}/languages`,
                {
                    headers: { Authorization: this.getAuthHeader(), Accept: "application/vnd.github+json" },
                },
            );

            const languagesResponse: AxiosResponse<LanguagesDto> = await firstValueFrom(languagesObservable);
            return languagesResponse.data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.message, e.response.status);
            } else {
                throw e;
            }
        }
    }

    async getRepositoryZip(gitHubRepo: GitHubRepoDto) {
        try {
            const zipObservable: Observable<AxiosResponse<any>> = this.httpService.get(
                `${this.configService.get("GITHUB_URL", "https://api.github.com")}/repos/${gitHubRepo.owner}/${gitHubRepo.repo}/languages`,
                {
                    headers: { Authorization: this.getAuthHeader(), Accept: "application/vnd.github+json" },
                },
            );

            const zipResponse: AxiosResponse<any> = await firstValueFrom(zipObservable);
            return zipResponse.data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.message, e.response.status);
            } else {
                throw e;
            }
        }
    }
}
