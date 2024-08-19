import { IsISO8601, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDTO {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    createdBy: number;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    tableId: number;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    restaurantId: number;

    @IsISO8601({ strict: true })
    reservationStart: string;

    @IsNumber({}, { each: true })
    userIds: number[];
}
