import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateAnimeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    alternateTitle: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    synopsis: string;

    @IsString()
    poster: string;

    @IsString()
    @IsDateString()
    releaseDate: string;

    @IsNumber()
    @IsOptional()
    totalEpisode?: number;

    @IsNumber()
    statusId: number;

    @IsNumber()
    categoryId: number;

    @IsNumber()
    studioId: number;
}
