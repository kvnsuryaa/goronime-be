import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchduleService } from './schdule.service';
import { CreateSchduleDto } from './dto/create-schdule.dto';
import { UpdateSchduleDto } from './dto/update-schdule.dto';
import { ScheduleType } from '@prisma/client';

@Controller('schdule')
export class SchduleController {
  constructor(private readonly schduleService: SchduleService) { }

  @Post()
  add(@Body() createSchduleDto: CreateSchduleDto) {
    return this.schduleService.add(createSchduleDto);
  }

  @Get(':type')
  findAll(@Param('type') type: ScheduleType) {
    return this.schduleService.findAll(type);
  }

  @Get(':id')
  remove(@Param('id') id: string) {
    return this.schduleService.remove(id);
  }
}
