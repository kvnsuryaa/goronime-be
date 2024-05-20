import { Module } from '@nestjs/common';
import { SchduleService } from './schdule.service';
import { SchduleController } from './schdule.controller';

@Module({
  controllers: [SchduleController],
  providers: [SchduleService],
})
export class SchduleModule {}
