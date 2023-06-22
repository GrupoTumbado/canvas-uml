import { HttpException, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, map, Observable, reduce } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { GitHubRepoDto } from "../../dtos/github/git-hub-repo.dto";
import { LanguagesDto } from "../../dtos/github/languages.dto";

@Injectable()
export class GitHubService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    private readonly logger: Logger = new Logger(GitHubService.name);

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
            this.logger.error(e);
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
            this.logger.error(e);
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.message, e.response.status);
            } else {
                throw e;
            }
        }
    }

    async getRepositoryZip(gitHubRepo: GitHubRepoDto): Promise<Buffer> {
        try {
            const zipObservable: Observable<AxiosResponse<ArrayBuffer>> = this.httpService.get(
                `${this.configService.get("GITHUB_URL", "https://api.github.com")}/repos/${gitHubRepo.owner}/${gitHubRepo.repo}/zipball`,
                {
                    headers: { Authorization: this.getAuthHeader(), Accept: "application/vnd.github+json" },
                    responseType: "arraybuffer",
                },
            );

            return await zipObservable
                .pipe(
                    reduce((acc: Buffer[], response: AxiosResponse<ArrayBuffer>) => {
                        const chunk: Buffer = Buffer.from(response.data);
                        return acc.concat(chunk);
                    }, []),
                    map((chunks: Buffer[]) => Buffer.concat(chunks)),
                )
                .toPromise();
        } catch (e) {
            this.logger.error(e);
            if (e instanceof AxiosError) {
                throw new HttpException(e.response.data.message, e.response.status);
            } else {
                throw e;
            }
        }
    }
}
