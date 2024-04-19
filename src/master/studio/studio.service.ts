import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudioService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createStudioDto: CreateStudioDto) {
    const studio = await this.prisma.studio.create({
      data: {
        name: createStudioDto.name
      }
    })

    return studio
  }

  async findAll() {
    const studios = await this.prisma.studio.findMany({
      where: {
        isDeleted: false
      }
    })

    return studios
  }

  async findOne(id: string) {
    const studio = await this.prisma.studio.findFirst({
      where: {
        id: id
      }
    })

    if (!studio) {
      throw new NotFoundException('Studio not found')
    }

    return studio
  }

  async update(id: string, updateStudioDto: UpdateStudioDto) {
    const studio = await this.prisma.studio.update({
      where: {
        id: id,
        isDeleted: false,
      },
      data: {
        name: updateStudioDto.name
      }
    })
  }

  async remove(id: string) {
    await this.prisma.studio.update({
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
