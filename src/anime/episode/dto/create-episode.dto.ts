import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEpisodeDto {
    @IsNumber()
    episodeNumber: number

    @IsString()
    @IsNotEmpty()
    episodeSource: string
}
