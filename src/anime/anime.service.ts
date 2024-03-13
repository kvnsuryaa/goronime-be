import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Users } from '@prisma/client'

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {

  }
  async create(createAnimeDto: CreateAnimeDto, user: Users) {

    const status_anime = await this.prisma.animeStatus.findFirst({
      where: {
        id: createAnimeDto.statusId
      }
    })

    if (!status_anime) {
      throw new NotFoundException('Status not found')
    }

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

    await this.prisma.anime.create({
      data: {
        title: createAnimeDto.title,
        alternateTitle: createAnimeDto.alternateTitle,
        slug: createAnimeDto.slug,
        synopsis: createAnimeDto.synopsis,
        poster: createAnimeDto.poster,
        releaseDate: createAnimeDto.releaseDate,
        statusId: status_anime.id,
        categoryId: category_anime.id,
        studioId: studio_anime.id,
        createdById: user.id,
      }
    })
    return 'This action adds a new anime';
  }

  findAll() {
    return `This action returns all anime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anime`;
  }

  update(id: number, updateAnimeDto: UpdateAnimeDto) {
    return `This action updates a #${id} anime`;
  }

  remove(id: number) {
    return `This action removes a #${id} anime`;
  }
}
