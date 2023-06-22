import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { LinksDto } from "./upload-info-dtos/links.dto";

export class UploadInfoDto {
    @IsNumber()
    public id: number;

    @IsString()
    public projectName: string;

    @IsNumber()
    public size: number;

    @IsString()
    public fileType: string;

    @IsArray()
    public messages: string[];

    @IsBoolean()
    public parsed: boolean;

    @IsBoolean()
    public badRequest: boolean;

    public _links: LinksDto;
}
