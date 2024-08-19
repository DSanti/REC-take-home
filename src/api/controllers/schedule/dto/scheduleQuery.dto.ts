import {
    IsISO8601,
    IsInt,
    Min,
    IsNumber,
    IsString,
    IsEmail,
    IsArray,
    IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ScheduleQuery {
    @IsISO8601({ strict: true })
    reservationStart: string;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    aditionalSeats: number;

    @IsArray()
    @IsNumber({}, { each: true })
    @Transform(({ value }) =>
        value
            .trim()
            .split(',')
            .map((value) => parseInt(value)),
    )
    userIds: number[];

    @IsNotEmpty()
    @IsArray()
    @IsEmail({}, { each: true })
    @Transform(({ value }) =>
        value
            .trim()
            .split(',')
            .filter((pn) => pn.length > 1),
    )
    userEmails: string[];

    @IsString({ each: true })
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        value
            .trim()
            .split(',')
            .filter((em) => em.length > 1),
    )
    @IsNotEmpty()
    userPhoneNumbers: string[];
}
