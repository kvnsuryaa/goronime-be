import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.prisma.genre.create({
      data: {
        name: createGenreDto.name
      }
    })

    return genre
  }

  async findAll() {
    const genres = await this.prisma.genre.findMany({
      where: {
        isDeleted: false
      }
    })

    return genres
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findFirst({
      where: {
        id: id,
        isDeleted: false
      }
    })

    if (!genre) {
      throw new NotFoundException('Genre not found')
    }

    return genre
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.prisma.genre.update({
      where: {
        id: id,
        isDeleted: false
      },
      data: {
        name: updateGenreDto.name
      }
    })

    return genre
  }

  async remove(id: number) {
    await this.prisma.genre.update({
      where: {
        id: id,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    })
  }
}
