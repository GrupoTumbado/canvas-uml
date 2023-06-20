import { IsBoolean } from "class-validator";

export class NamesAndRolesDto {
    @IsBoolean()
    public available: boolean;
}
