import { Logger } from 'loglevel';

export const errorHandler = (error, req, res, next) => {
    // Logging the error here
    console.log(error);

    switch (error.name) {
        case 'reservation_not_found': {
            return res.status(404).send({
                message: error.message,
            });
        }
        case 'unrelated_user':
        case 'user_double_booked': {
            return res.status(403).send({
                message: error.message,
            });
        }
        case 'unknown_user': {
            return res.status(401).send({
                message: error.message,
            });
        }
        case 'PrismaClientUnknownRequestError': {
            if (error.message.includes('Error: Reservations cannot overlap.')) {
                return res.status(403).send({
                    message:
                        'The table selected has already been reserved by another user.',
                });
            }
        }
        default: {
            return res.status(500).send({
                message: error.message,
            });
        }
    }
};
