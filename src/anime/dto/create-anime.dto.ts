import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { AnimeStatus } from "@prisma/client";

export class CreateAnimeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    alternateTitle?: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    synopsis?: string;

    @IsString()
    poster?: string;

    @IsString()
    @IsOptional()
    releaseDate?: string;

    @IsNumber()
    @IsOptional()
    totalEpisode?: number;

    @IsEnum(AnimeStatus)
    statusAnime: AnimeStatus;

    @IsString()
    @IsUUID()
    categoryId: string;

    @IsString()
    @IsUUID()
    @IsOptional()
    studioId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    genres?: string[];
}
