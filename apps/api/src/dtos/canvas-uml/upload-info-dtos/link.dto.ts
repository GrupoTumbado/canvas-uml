import { IsUrl } from "class-validator";

export class LinkDto {
    @IsUrl()
    href: string;
}
