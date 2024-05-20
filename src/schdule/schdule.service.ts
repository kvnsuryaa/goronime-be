import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSchduleDto } from './dto/create-schdule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleType } from '@prisma/client';

@Injectable()
export class SchduleService {
  constructor(private prisma: PrismaService) { }

  async add(createSchduleDto: CreateSchduleDto) {
    let i = 0
    const scheduleType = createSchduleDto.scheduleType
    while (i < createSchduleDto.animes.length) {
      const animeId = createSchduleDto.animes[i]
      await this.prisma.animeSchedule.create({
        data: {
          scheduleType: scheduleType,
          animeId: animeId
        }
      })
      i++
    }
  }

  async findAll(type: ScheduleType) {
    if (!type) {
      throw new BadRequestException('required valid parameter type')
    }

    const schedules = await this.prisma.animeSchedule.findMany({
      where: {
        scheduleType: type
      },
      include: {
        anime: true
      }
    })

    return schedules
  }

  async remove(id: string) {
    await this.prisma.animeSchedule.delete({
      where: {
        id: id
      }
    })
  }
}
