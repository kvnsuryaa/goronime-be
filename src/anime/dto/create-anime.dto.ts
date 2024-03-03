import { IsEmail, IsString } from 'class-validator'

export class CreateAnimeDto {

    @IsString()
    private title: string
}
