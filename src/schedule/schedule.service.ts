import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleType } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) { }

  async add(createScheduleDto: CreateScheduleDto) {
    let i = 0
    const scheduleType = createScheduleDto.scheduleType
    while (i < createScheduleDto.animes.length) {
      const animeId = createScheduleDto.animes[i]
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
        anime: {
          include: {
            category: true
          }
        }
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
