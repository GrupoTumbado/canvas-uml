import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";
import { ContextDto } from "./launch-dtos/context.dto";
import { ResourceDto } from "./launch-dtos/resource.dto";
import { PresentationDto } from "./launch-dtos/presentation.dto";

export class LaunchDto {
    @IsString()
    public type: string;

    @IsUrl()
    public target: string;

    @IsUrl()
    @IsOptional()
    public lineItemId?: string;

    public context: ContextDto;

    public resource: ResourceDto;

    public presentation: PresentationDto;

    public custom?: Object;
}
