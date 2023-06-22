import { GitHubRepoDto } from "../github/git-hub-repo.dto";
import { IdTokenDto } from "../ltiaas/id-token.dto";

export class SubmissionJobDto {
    public ltik: string;
    public idToken: IdTokenDto;
    public gitHubRepo: GitHubRepoDto;
    public javaToUmlId?: number;
}
