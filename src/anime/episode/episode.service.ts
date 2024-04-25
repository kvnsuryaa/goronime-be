import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EpisodeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(animeId: string, createEpisodeDto: CreateEpisodeDto) {
    const anime = await this.prisma.anime.findFirst({
      where: {
        id: animeId
      }
    })

    if (!anime) {
      throw new NotFoundException('Anime not found')
    }

    // checking for episode number
    const episode = await this.prisma.animeEpisode.findFirst({
      where: {
        animeId: anime.id,
        episodeNumber: createEpisodeDto.episodeNumber,
      }
    })

    if (episode) {
      throw new ConflictException('Conflict Episode Number')
    }

    const episodeCreated = await this.prisma.animeEpisode.create({
      data: {
        animeId: anime.id,
        episodeNumber: createEpisodeDto.episodeNumber,
        episodeSource: createEpisodeDto.episodeSource
      }
    })

    return episodeCreated
  }

  async findAll(animeSlug: string) {
    const episodes = await this.prisma.animeEpisode.findMany({
      include: {
        anime: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        }
      },
      where: {
        anime: {
          slug: animeSlug
        }
      }
    })

    return episodes
  }

  async findOne(animeId: string, id: string) {
    const episode = await this.prisma.animeEpisode.findFirst({
      where: {
        animeId: animeId,
        id: id
      }
    })

    if (!episode) {
      throw new NotFoundException('Anime not found')
    }

    return episode
  }

  async remove(animeId: string, id: string) {
    await this.prisma.animeEpisode.delete({
      where: {
        animeId: animeId,
        id: id
      }
    })
  }
}
