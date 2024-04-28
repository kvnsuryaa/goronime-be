import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Controller('anime/:anime/episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) { }

  @Post()
  create(@Param('anime') anime: string, @Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.create(anime, createEpisodeDto);
  }

  @Get()
  findAll(@Param('anime') anime: string) {
    return this.episodeService.findAll(anime);
  }

  @Get(':id')
  findOne(@Param('anime') anime: string, @Param('id', new ParseIntPipe()) id: number) {
    return this.episodeService.findOne(anime, +id);
  }

  @Delete(':id')
  remove(@Param('anime') anime: string, @Param('id') id: string) {
    return this.episodeService.remove(anime, id);
  }
}
