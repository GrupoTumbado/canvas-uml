import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";
import { LisDto } from "./platform-dtos/lis.dto";
import { DeepLinkingSettingsDto } from "./platform-dtos/deep-linking-settings.dto";

export class PlatformDto {
    @IsString()
    public id: string;

    @IsUrl()
    public url: string;

    @IsEmail()
    public clientId: string;

    @IsString()
    public deploymentId: string;

    @IsString()
    public name: string;

    @IsString()
    public guid: string;

    @IsString()
    public version: string;

    @IsString()
    public product_family_code: string;

    public lis: LisDto;

    @IsOptional()
    public deepLinkingSettingsDto?: DeepLinkingSettingsDto;
}
