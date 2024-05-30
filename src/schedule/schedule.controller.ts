import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleType } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post()
  add(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.add(createScheduleDto);
  }

  @Get(':type')
  findAll(@Param('type') type: ScheduleType) {
    return this.scheduleService.findAll(type);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
