export const createReservationRequest = {
    userIds: [1],
    reservationStart: '2024-08-11T10:10:00.000Z',
    createdBy: 1,
    tableId: 1,
    restaurantId: 1,
};

export const createReservationBadRequest = {
    userIds: [1],
    reservationStart: '2024-08-11T10:10:00.000Z',
};

export const createReservationUnrelatedRequest = {
    userIds: [1],
    reservationStart: '2024-08-11T10:10:00.000Z',
    createdBy: 5,
    tableId: 1,
    restaurantId: 1,
};
export const reservation = {
    id: 1,
    restaurant_id: 1,
    table_id: 1,
    start_date: new Date('2024-08-11T10:10:00.000Z'),
    end_date: new Date('2024-08-11T12:10:00.000Z'),
    created_by: 1,
};
export const user = {
    id: 1,
    email: 'someMail@someDomain.com',
    phone: '+55555',
    name: 'testName',
    surname: 'testSurname',
    dietary_restrictions: { paleo: true },
};

export const createReservationResponse = {
    created_by: 1,
    end_date: '2024-08-11T12:10:00.000Z',
    id: 1,
    restaurant_id: 1,
    start_date: '2024-08-11T10:10:00.000Z',
    table_id: 1,
};

export const createReservationUnrelatedResponse = {
    message: 'User must be part of a reservation to create it.',
};

export const reservationBadRequestResponse = {
    message: 'Request validation failed.',
};

export const createReservationDoubleBookingResponse = {
    message: 'The table selected has already been reserved by another user.',
};

export const createReservationUnregisteredResponse = {
    message: "The reservation's creator must be a registered user.",
};

export const deleteReservationRequest = {
    deletedBy: 1,
};

export const deleteReservationUsers = [
    {
        reservation_id: 1,
        user_id: 1,
    },
];

export const deleteReservationUsersUnrelated = [
    {
        reservation_id: 1,
        user_id: 2,
    },
];

export const deleteReservationResponse = {
    message: 'Reservation with id 1 was deleted successfully.',
};

export const deleteReservationUnrelatedResponse = {
    message: 'User must be part of a reservation to modify it.',
};

export const deleteReservationUnregisteredResponse = {
    message: 'User must be registered to modify any reservation.',
};

export const deleteReservationNotFoundResponse = {
    message: 'Reservation with id 1 could not be found.',
};
