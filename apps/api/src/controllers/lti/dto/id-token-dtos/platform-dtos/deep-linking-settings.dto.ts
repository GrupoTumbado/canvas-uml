import { IsArray, IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class DeepLinkingSettingsDto {
    @IsUrl()
    public deep_link_return_url: string;

    @IsBoolean()
    public auto_create: boolean;

    @IsArray()
    public accept_types: string[];

    @IsString()
    public accept_media_types: string;

    @IsBoolean()
    public accept_multiple: boolean;

    @IsArray()
    public accept_presentation_document_targets: string[];

    @IsString()
    @IsOptional()
    public validation_context?: string;

    @IsOptional()
    public errors?: Object;
}
