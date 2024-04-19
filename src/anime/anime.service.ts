import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Users } from '@prisma/client'
import { AnimeGenreDto } from './dto/anime-genre.dto';

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {

  }
  async create(createAnimeDto: CreateAnimeDto, user: Users) {
    const category_anime = await this.prisma.category.findFirst({
      where: {
        id: createAnimeDto.categoryId
      }
    })

    if (!category_anime) {
      throw new NotFoundException('Category not found')
    }

    const studio_anime = await this.prisma.studio.findFirst({
      where: {
        id: createAnimeDto.studioId
      }
    })

    if (!category_anime) {
      throw new NotFoundException('Category not found')
    }

    console.log('user', user)
    const anime = await this.prisma.anime.create({
      data: {
        title: createAnimeDto.title,
        alternateTitle: createAnimeDto.alternateTitle,
        slug: createAnimeDto.slug,
        synopsis: createAnimeDto.synopsis,
        poster: createAnimeDto.poster,
        releaseDate: createAnimeDto.releaseDate,
        statusAnime: createAnimeDto.statusAnime,
        categoryId: category_anime.id,
        studioId: studio_anime.id,
        createdById: user.id,
      }
    })

    // insert for anime genre
    const genres: Array<AnimeGenreDto> = []
    let i = 0
    while (i < createAnimeDto.genres.length) {
      const genreId = createAnimeDto.genres[i]
      genres.push({
        genreId: genreId,
        animeId: anime.id
      })
      i++
    }

    await this.prisma.animeGenre.createMany({
      data: genres
    })

    return anime;
  }

  async findAll(query: any) {
    let { page, limit } = query
    page = page || 1
    limit = limit || 10

    const filter = {}
    filter['isDeleted'] = false

    const offset = page * limit - limit
    const total_data = await this.prisma.anime.count({
      where: filter
    });
    const datas = await this.prisma.anime.findMany({
      take: 10,
      skip: offset,
      where: filter,
    })
    const paginate = {
      total_page: Math.ceil(total_data / limit),
      total: Number(total_data),
      current_page: Number(page),
    }

    return {
      list: datas,
      pagination: paginate
    }
  }

  async findOne(slug: string) {
    const data = await this.prisma.anime.findFirstOrThrow({
      where: {
        slug: slug
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        studio: {
          select: {
            id: true,
            name: true
          }
        },
        animeGenre: {
          include: {
            genre: true
          }
        }
      },
    })

    return data
  }

  async update(id: string, updateAnimeDto: UpdateAnimeDto) {
    const category_anime = await this.prisma.category.findFirst({
      where: {
        id: updateAnimeDto.categoryId
      }
    })

    if (!category_anime) {
      throw new NotFoundException('Category not found')
    }

    const studio_anime = await this.prisma.studio.findFirst({
      where: {
        id: updateAnimeDto.studioId
      }
    })

    if (!category_anime) {
      throw new NotFoundException('Category not found')
    }

    const anime = await this.prisma.anime.update({
      where: {
        id: id,
        isDeleted: false
      },
      data: {
        title: updateAnimeDto.title,
        alternateTitle: updateAnimeDto.alternateTitle,
        slug: updateAnimeDto.slug,
        synopsis: updateAnimeDto.synopsis,
        poster: updateAnimeDto.poster,
        releaseDate: updateAnimeDto.releaseDate,
        statusAnime: updateAnimeDto.statusAnime,
        categoryId: category_anime.id,
        studioId: studio_anime.id,
      }
    })

    await this.prisma.animeGenre.deleteMany({
      where: {
        animeId: id,
      }
    })

    const genres: Array<AnimeGenreDto> = []
    let i = 0
    while (i < updateAnimeDto.genres.length) {
      const genreId = updateAnimeDto.genres[i]
      genres.push({
        genreId: genreId,
        animeId: anime.id
      })
      i++
    }

    await this.prisma.animeGenre.createMany({
      data: genres
    })

    return anime
  }

  async remove(id: string) {
    await this.prisma.anime.update({
      where: {
        id: id
      },
      data: {
        isDeleted: true
      }
    })
  }
}
