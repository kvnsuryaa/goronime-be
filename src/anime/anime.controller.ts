import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Prisma, Users } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@User() user: Users, @Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto, user);
  }

  @Get()
  findAll(@Query() query) {
    return this.animeService.findAll(query);
  }

  @Get('detail/:slug')
  findOne(@Param('slug') slug: string) {
    return this.animeService.findOne(slug);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body(ValidationPipe) updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }

  @Get('recents')
  findRecentRelease(@Query() query) {
    return this.animeService.findRecentRelease(query);
  }
}
