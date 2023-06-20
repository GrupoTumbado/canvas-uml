import { IsString } from "class-validator";

export class LtiaasCallbackDto {
    @IsString()
    public ltik: string;
}
