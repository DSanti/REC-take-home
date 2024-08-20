import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteReservationDTO {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    deletedBy: number;
}
