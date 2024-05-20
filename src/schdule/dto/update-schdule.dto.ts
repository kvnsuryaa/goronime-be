import { PartialType } from '@nestjs/mapped-types';
import { CreateSchduleDto } from './create-schdule.dto';

export class UpdateSchduleDto extends PartialType(CreateSchduleDto) {}
