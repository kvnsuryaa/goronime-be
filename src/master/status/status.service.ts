import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createStatusDto: CreateStatusDto) {
    const status = await this.prisma.animeStatus.create({
      data: {
        name: createStatusDto.name
      }
    })

    return status
  }

  async findAll() {
    const status = await this.prisma.animeStatus.findMany({
      where: {
        isDeleted: false
      }
    })

    return status
  }

  async findOne(id: number) {
    const status = await this.prisma.animeStatus.findFirst({
      where: {
        id: id,
        isDeleted: false
      }
    })

    if (!status) {
      throw new NotFoundException('Status not found')
    }

    return status
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    const status = await this.prisma.animeStatus.update({
      where: {
        id: id
      },
      data: {
        name: updateStatusDto.name
      }
    })

    return status
  }

  async remove(id: number) {
    await this.prisma.animeStatus.update({
      where: {
        id: id
      },
      data: {
        isDeleted: true
      }
    })
  }
}
