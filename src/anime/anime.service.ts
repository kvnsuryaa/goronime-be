import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnimeStatus, Prisma, Users } from '@prisma/client'
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

    let studio_anime = null
    if (createAnimeDto.studioId) {
      studio_anime = await this.prisma.studio.findFirst({
        where: {
          id: createAnimeDto.studioId
        }
      })

      if (!studio_anime) {
        throw new NotFoundException('Studio not found')
      }
    }

    const anime = await this.prisma.anime.create({
      data: {
        title: createAnimeDto.title,
        alternateTitle: createAnimeDto.alternateTitle,
        slug: createAnimeDto.slug,
        synopsis: createAnimeDto.synopsis,
        poster: createAnimeDto.poster,
        releaseDate: createAnimeDto.releaseDate,
        statusAnime: createAnimeDto.statusAnime,
        totalEpisode: createAnimeDto.totalEpisode,
        categoryId: category_anime.id,
        studioId: studio_anime ? studio_anime.id : null,
        createdById: user.id,
      }
    })

    // insert for anime genre
    if (createAnimeDto.genres) {
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
    }

    return anime;
  }

  async findAll(query: any) {
    let { page, limit, search, res } = query
    page = page || 1
    limit = limit || 10

    const filter = {}
    filter['isDeleted'] = false
    if (search) {
      filter['title'] = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (res === 'text') {
      const res = await this.prisma.$queryRaw`SELECT STRING_AGG(title || '(@)' || slug || '(@)' || poster, '(|)') as all 
      FROM (
        SELECT title, slug, poster FROM "Anime" WHERE "isDeleted" = false ORDER BY title ASC
      ) a;`
      return res
    }

    const offset = page * limit - limit
    const total_data = await this.prisma.anime.count({
      where: filter
    });
    const datas = await this.prisma.anime.findMany({
      take: 10,
      skip: offset,
      where: filter,
      include: {
        category: true,
      }
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
          select: {
            genre: true
          }
        },
        AnimeEpisode: {
          select: {
            episodeNumber: true,
            createdAt: true,
          },
          orderBy: {
            episodeNumber: 'desc'
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
        totalEpisode: updateAnimeDto.totalEpisode,
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

  async findRecentRelease(query: any) {
    let { page, limit, status } = query
    page = page || 1
    limit = limit || 10
    if (!AnimeStatus[status as keyof typeof AnimeStatus]) {
      status = AnimeStatus.ONGOING
    } else {
      status = AnimeStatus[status as keyof typeof AnimeStatus]
    }

    const offset = page * limit - limit
    const res = await this.prisma.$queryRaw`SELECT "Anime".*, "Category".name AS "categoryName", "latestEpisodeNumber", "latestCreatedAt"
    FROM "Anime"
    INNER JOIN (
        SELECT "animeId", MAX("episodeNumber") AS "latestEpisodeNumber", MAX("createdAt") AS "latestCreatedAt"
        FROM "AnimeEpisode"
        GROUP BY "animeId"
    ) AS "latestEpisodes" ON "Anime".id = "latestEpisodes"."animeId" 
    INNER JOIN "Category" ON "Category".id = "Anime"."categoryId"
    WHERE "statusAnime"::text = ${status}
    ORDER BY "latestCreatedAt" DESC LIMIT ${limit} OFFSET ${offset};`
    return res
  }
}
