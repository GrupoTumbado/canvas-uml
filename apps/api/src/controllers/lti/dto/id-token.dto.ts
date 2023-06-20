import { IsString } from "class-validator";
import { UserDto } from "./id-token-dtos/user.dto";
import { PlatformDto } from "./id-token-dtos/platform.dto";
import { LaunchDto } from "./id-token-dtos/launch.dto";
import { ServicesDto } from "./id-token-dtos/services.dto";

export class IdTokenDto {
    @IsString()
    public ltiVersion: string;

    public user: UserDto;

    public platform: PlatformDto;

    public launch: LaunchDto;

    public services: ServicesDto;
}
