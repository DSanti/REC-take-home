import express from 'express';
import { addHours } from 'date-fns';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { APIError } from '../../../classes/apiError';
import { ScheduleQuery } from './dto/scheduleQuery.dto';
import { getReservationByUsersAndTime } from './../../services/reservation/reservation';
import { getUsersMultiId } from '../../services/user';
import { getRestaurantsByDietaryRestrictions } from '../../services/restaurant';
import { getAvailableTablesForSchedule } from '../../services/schedule';
import { summarizeDietaryRestrictions } from '../../../utils';

export const schedulingRouter = express.Router();

schedulingRouter.get('/', async (req, res, next) => {
    try {
        const requestQueryParams = plainToClass(ScheduleQuery, req.query);
        const validationErrors = await validate(requestQueryParams);
        if (validationErrors.length > 0) {
            throw new APIError(
                'validation_error',
                'Request query validation failed.',
            );
        }

        const {
            userIds,
            userEmails,
            userPhoneNumbers,
            reservationStart,
            aditionalSeats,
        } = requestQueryParams;

        const registeredUsers = await getUsersMultiId(
            userIds,
            userEmails,
            userPhoneNumbers,
        );

        const reservationStartDate = new Date(reservationStart);

        const reservationEndDate = addHours(reservationStartDate, 2); // Default reservations last 2 hours.

        const userReservations = await getReservationByUsersAndTime(
            registeredUsers,
            reservationStartDate,
            reservationEndDate,
        );

        if (userReservations.length > 0) {
            throw new APIError(
                'user_double_booked',
                'One or more users already have reservations at this time.',
            );
        }

        const totalSeating =
            userIds.length +
            userEmails.length +
            userPhoneNumbers.length +
            aditionalSeats;

        const filteredRestaurants = await getRestaurantsByDietaryRestrictions(
            summarizeDietaryRestrictions(registeredUsers),
        );

        const availableTables = await getAvailableTablesForSchedule(
            reservationStartDate,
            reservationEndDate,
            filteredRestaurants,
            totalSeating,
        );

        res.json(availableTables);
    } catch (err) {
        return next(err);
    }
});
