import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AnimeModule } from './anime/anime.module';
import { AuthModule } from './auth/auth.module';
import { StudioModule } from './master/studio/studio.module';
import { GenreModule } from './master/genre/genre.module';
import { CategoryModule } from './master/category/category.module';
import { StatusModule } from './master/status/status.module';

@Module({
  imports: [
    AnimeModule,
    PrismaModule,
    AuthModule,
    StudioModule,
    GenreModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    StatusModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
