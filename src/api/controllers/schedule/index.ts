import express from 'express';
import logger from 'loglevel';
import { addHours } from 'date-fns';

import { APIError } from '../../../classes/apiError';
import { getReservationByUsersAndTime } from './../../services/reservation/reservation';
import { getUsersMultiId } from '../../services/user';
import { getRestaurantsByDietaryRestrictions } from '../../services/restaurant';
import { getAvailableTablesForSchedule } from '../../services/schedule';
import { summarizeDietaryRestrictions } from '../../../utils';

export const schedulingRouter = express.Router();

schedulingRouter.get('/', async (req, res, next) => {
    try {
        const { users, reservationStart, aditionalSeats } = req.body;

        const { userIds, emails, phoneNumbers } = users;

        const registeredUsers = await getUsersMultiId(
            userIds,
            emails,
            phoneNumbers,
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
            emails.length +
            phoneNumbers.length +
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
