import { ScheduleType } from "@prisma/client";
import { IsArray, IsEnum, IsString } from "class-validator";

export class CreateSchduleDto {

    @IsEnum(ScheduleType)
    scheduleType: ScheduleType;

    @IsArray()
    @IsString({ each: true })
    animes: string[]

}
