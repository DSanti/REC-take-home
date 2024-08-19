import { Prisma, restaurants } from '@prisma/client';
import { AvailableTable } from '../../../types/types';
import prisma from '../../prismaClient';

export const getAvailableTablesForSchedule = async (
    reservationStart: Date,
    reservationEnd: Date,
    filteredRestaurants: restaurants[],
    totalSeating: number,
) => {
    const results = await prisma.$queryRaw<AvailableTable[]>`
    SELECT
        rt.table_id,
        rt.restaurant_id,
        r.name,
        r.serves_vegetarian,
        r.serves_paleo,
        r.serves_vegan,
        r.serves_gluten_free,
        ta.size,
        CAST((ta.size - ${totalSeating}) AS integer) as empty_seats,
        res.id as reservation_id
	FROM restaurant_tables rt 
	LEFT JOIN (
		SELECT table_id, id 
		FROM reservations 
		WHERE start_date > ${reservationEnd} 
		OR end_date > ${reservationStart}
	) res ON rt.table_id = res.table_id,
	tables ta,
	restaurants r
	WHERE rt.restaurant_id IN (${Prisma.join(filteredRestaurants.map((restaurant) => restaurant.id))}) 
    AND ta.id = rt.table_id
	AND r.id = rt.restaurant_id
	AND ta.size >= ${totalSeating}
	AND res.id IS NULL
    ORDER BY empty_seats;`;

    return results;
};
