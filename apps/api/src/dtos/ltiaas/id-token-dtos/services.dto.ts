import { IsString } from "class-validator";
import { OutcomesDto } from "./services-dtos/outcomes.dto";
import { DeepLinkingDto } from "./services-dtos/deep-linking.dto";
import { AssignmentAndGradesDto } from "./services-dtos/assignment-and-grades.dto";
import { NamesAndRolesDto } from "./services-dtos/names-and-roles.dto";

export class ServicesDto {
    @IsString()
    public serviceKey: string;

    public outcomes: OutcomesDto;

    public deepLinking: DeepLinkingDto;

    public assignmentAndGrades: AssignmentAndGradesDto;

    public namesAndRoles: NamesAndRolesDto;
}
