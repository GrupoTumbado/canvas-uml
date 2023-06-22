import { IsString } from "class-validator";

export class SvgQueryDto {
    @IsString()
    id: string;
}
