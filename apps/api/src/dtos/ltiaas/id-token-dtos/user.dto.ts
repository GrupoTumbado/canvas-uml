import { IsArray, IsEmail, IsString } from "class-validator";

export class UserDto {
    @IsString()
    public id: string;

    @IsString()
    public name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public given_name: string;

    @IsString()
    public family_name: string;

    @IsArray()
    public roles: string[];
}
