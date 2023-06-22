import { IsOptional, IsString } from "class-validator";

export class ContentItemDto {
    @IsString()
    type: string = "file";

    @IsString()
    url: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    media_type?: string;
}
