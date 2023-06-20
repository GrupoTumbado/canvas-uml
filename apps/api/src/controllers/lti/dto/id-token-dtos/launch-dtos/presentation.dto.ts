import { IsLocale, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class PresentationDto {
    @IsLocale()
    public locale: string;

    @IsString()
    public document_target: string;

    @IsUrl()
    public return_url: string;

    @IsNumber()
    @IsOptional()
    public width: number;

    @IsNumber()
    @IsOptional()
    public height: number;
}
