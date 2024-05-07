import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudioService } from './studio.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createStudioDto: CreateStudioDto) {
    return this.studioService.create(createStudioDto);
  }

  @Get()
  findAll() {
    return this.studioService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.studioService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateStudioDto: UpdateStudioDto) {
    return this.studioService.update(id, updateStudioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.studioService.remove(id);
  }
}
