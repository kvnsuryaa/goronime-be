import { IsNotEmpty, IsString } from "class-validator";

export class CreateStudioDto {
    @IsNotEmpty()
    @IsString()
    name: string
}
