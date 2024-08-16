import logger from 'loglevel';
import { formatISO9075 } from 'date-fns';

import { Prisma, PrismaClient, users } from '@prisma/client';
import { UserReservation } from '../../../types/types';
import { createDecipheriv } from 'crypto';

const prisma = new PrismaClient();

export const getReservationUsers = async (reservationId: number) => {
    const result = await prisma.user_reservation.findMany({
        where: {
            reservation_id: reservationId,
        },
    });

    return result;
};

export const getReservation = async (reservationId: number) => {
    const result = await prisma.reservations.findUnique({
        where: {
            id: reservationId,
        },
    });

    return result;
};

export const deleteReservation = async (reservationId: number) => {
    const result = await prisma.reservations.delete({
        where: {
            id: reservationId,
        },
    });

    return result;
};

export const getReservationByUsersAndTime = async (
    users: users[],
    reservationStart: Date,
    reservationEnd: Date,
) => {
    const result = await prisma.reservations.findMany({
        where: {
            AND: [
                {
                    user_reservation: {
                        some: {
                            user_id: {
                                in: users.map((u) => u.id),
                            },
                        },
                    },
                },
            ],
            OR: [
                {
                    start_date: {
                        gte: reservationStart,
                        lte: reservationEnd,
                    },
                },
                {
                    end_date: {
                        gte: reservationStart,
                        lte: reservationEnd,
                    },
                },
            ],
        },
        select: {
            start_date: true,
            end_date: true,
            user_reservation: {
                select: {
                    user_id: true,
                },
            },
        },
    });

    return result;
};

export const createReservation = async (
    users: users[],
    reservationStart: Date,
    reservationEnd: Date,
    restaurantId: number,
    tableId: number,
    createdBy: number,
) => {
    const createdReservation = await prisma.reservations.create({
        data: {
            restaurant_id: restaurantId,
            table_id: tableId,
            created_by: createdBy,
            start_date: reservationStart,
            end_date: reservationEnd,
        },
    });

    await prisma.user_reservation.createMany({
        data: users.map((u) => {
            return {
                reservation_id: createdReservation.id,
                user_id: u.id,
            };
        }),
    });

    return createdReservation;
};
