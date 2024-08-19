export const user = {
    id: 1,
    email: 'someMail@someDomain.com',
    phone: '+55555',
    name: 'testName',
    surname: 'testSurname',
    dietary_restrictions: {
        paleo: true,
        vegan: true,
        vegetarian: true,
        gluten_free: true,
    },
};

export const restaurant = {
    id: 2,
    name: 'testRestaurant',
    open_time: new Date('1970-01-01T00:00:00.000Z'),
    closing_time: new Date('1970-01-01T00:00:00.000Z'),
    reservation_window: 0,
    cancellation_window: 0,
    serves_vegan: true,
    serves_vegetarian: true,
    serves_paleo: true,
    serves_gluten_free: false,
};

export const reservation = {
    id: 1,
    restaurant_id: 1,
    table_id: 1,
    start_date: new Date('2024-08-11T10:10:00.000Z'),
    end_date: new Date('2024-08-11T12:10:00.000Z'),
    created_by: 1,
};

export const getScheduleQuery = {
    userIds: '1',
    userEmails: '',
    userPhoneNumbers: '',
    reservationStart: '2024-08-11T10:10:00.000Z',
    aditionalSeats: '1',
};

export const getScheduleQueryBadRequest = {
    userIds: '1',
    userEmails: 'testMail.com',
    userPhoneNumbers: '',
    reservationStart: '2024-08-11T10:10:00.000Z',
    aditionalSeats: '1',
};

export const availableTable = {
    table_id: 1,
    restaurant_id: 2,
    name: 'testRestaurant',
    serves_vegetarian: true,
    serves_paleo: true,
    serves_vegan: true,
    serves_gluten_free: false,
    size: 2,
    empty_seats: 2,
    reservation_id: null,
};

export const scheduleDoubleBookedResponse = {
    message: 'One or more users already have reservations at this time.',
};

export const scheduleBadRequestResponse = {
    message: 'Request query validation failed.',
};
