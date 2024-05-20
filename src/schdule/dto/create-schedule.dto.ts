import { ScheduleType } from "@prisma/client";
import { IsArray, IsEnum, IsString } from "class-validator";

export class CreateScheduleDto {

    @IsEnum(ScheduleType)
    scheduleType: ScheduleType;

    @IsArray()
    @IsString({ each: true })
    animes: string[]

}
