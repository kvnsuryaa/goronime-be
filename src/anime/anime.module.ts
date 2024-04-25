import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { EpisodeModule } from './episode/episode.module';

@Module({
  controllers: [AnimeController],
  providers: [AnimeService],
  imports: [EpisodeModule],
})
export class AnimeModule { }
