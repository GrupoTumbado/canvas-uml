import { IsArray, IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class DeepLinkingDto {
    @IsBoolean()
    public available: boolean;

    @IsUrl()
    @IsOptional()
    public deep_link_return_url?: string;

    @IsBoolean()
    @IsOptional()
    public auto_create?: boolean;

    @IsArray()
    @IsOptional()
    public accept_types?: string[];

    @IsString()
    @IsOptional()
    public accept_media_types?: string;

    @IsBoolean()
    @IsOptional()
    public accept_multiple?: boolean;

    @IsArray()
    @IsOptional()
    public accept_presentation_document_targets?: string[];
}
