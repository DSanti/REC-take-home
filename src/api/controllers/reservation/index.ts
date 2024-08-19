import express from 'express';
import { addHours } from 'date-fns';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { getUsersByIds } from '../../services/user';
import {
    createReservation,
    getReservationUsers,
    deleteReservation,
    getReservation,
} from '../../services/reservation/reservation';
import { APIError } from '../../../classes/apiError';
import { CreateReservationDTO } from './dto/createReservation.dto';
import { DeleteReservationDTO } from './dto/deleteReservation.dto';

export const reservationRouter = express.Router();

reservationRouter.post('/', async (req, res, next) => {
    try {
        const validationErrors = await validate(
            plainToClass(CreateReservationDTO, req.body),
        );
        if (validationErrors.length > 0) {
            throw new APIError(
                'validation_error',
                'Request validation failed.',
            );
        }

        const { userIds, reservationStart, createdBy, tableId, restaurantId } =
            req.body;

        if (!userIds.includes(createdBy)) {
            throw new APIError(
                'unrelated_user',
                'User must be part of a reservation to create it.',
            );
        }

        const registeredUsers = await getUsersByIds(userIds);

        if (!registeredUsers.map((ru) => ru.id).includes(createdBy)) {
            throw new APIError(
                'unknown_user',
                "The reservation's creator must be a registered user.",
            );
        }

        const reservationStartDate = new Date(reservationStart);

        const reservationEndDate = addHours(reservationStartDate, 2); // Default reservations last 2 hours.

        const reservation = await createReservation(
            registeredUsers,
            reservationStartDate,
            reservationEndDate,
            restaurantId,
            tableId,
            createdBy,
        );

        res.json(reservation);
    } catch (err) {
        return next(err);
    }
});

reservationRouter.delete('/', async (req, res, next) => {
    try {
        const validationErrors = await validate(
            plainToClass(DeleteReservationDTO, req.body),
        );
        if (validationErrors.length > 0) {
            throw new APIError(
                'validation_error',
                'Request validation failed.',
            );
        }

        const { reservationId, deletedBy } = req.body;

        const reservation = await getReservation(reservationId);

        if (!reservation) {
            throw new APIError(
                'reservation_not_found',
                `Reservation with id ${reservationId} could not be found.`,
            );
        }

        const registeredUsers = await getUsersByIds([deletedBy]);

        if (registeredUsers.length === 0) {
            throw new APIError(
                'unknown_user',
                'User must be registered to modify any reservation.',
            );
        }

        const reservationUsers = await getReservationUsers(reservationId);

        if (!reservationUsers.map((ru) => ru.user_id).includes(deletedBy)) {
            throw new APIError(
                'unrelated_user',
                'User must be part of a reservation to modify it.',
            );
        }

        await deleteReservation(reservationId);

        res.status(200).send({
            message: `Reservation ${reservationId} deleted successfully.`,
        });
    } catch (err) {
        return next(err);
    }
});
