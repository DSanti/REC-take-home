import logger from 'loglevel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        logger.error(`Error: ${error.name} -- ${error.message}`);
    }

    switch (error.name) {
        case 'reservation_not_found': {
            res.status(404);
            break;
        }
        case 'unrelated_user':
        case 'user_double_booked': {
            res.status(403);
            break;
        }
        case 'unknown_user': {
            res.status(401);
            break;
        }
        case 'validation_error': {
            res.status(400);
            break;
        }
        case 'PrismaClientUnknownRequestError': {
            if (error.message.includes('Error: Reservations cannot overlap.')) {
                res.status(403);
                error.message =
                    'The table selected has already been reserved by another user.';
                break;
            }
        }
        default: {
            res.status(500);
        }
    }
    res.json({
        message: error.message,
        // 'stack' only used on dev enviroment
        ...(process.env.NODE_ENV === 'prod' ? null : { stack: error.stack }),
    });
};
