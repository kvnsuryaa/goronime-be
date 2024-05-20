import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AnimeModule } from './anime/anime.module';
import { AuthModule } from './auth/auth.module';
import { StudioModule } from './master/studio/studio.module';
import { GenreModule } from './master/genre/genre.module';
import { CategoryModule } from './master/category/category.module';
import { UploadsModule } from './uploads/uploads.module';
import { SchduleModule } from './schdule/schdule.module';

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
    CategoryModule,
    UploadsModule,
    SchduleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
