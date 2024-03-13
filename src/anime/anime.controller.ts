import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Prisma, Users } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) { }

  @Post()
  create(@User() user: Users, @Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto, user);
  }

  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body(ValidationPipe) updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(+id, updateAnimeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.animeService.remove(+id);
  }
}
