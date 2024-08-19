import 'reflect-metadata';
import express from 'express';

import { reservationRouter } from './reservation';
import { schedulingRouter } from './schedule';

export const apiRouter = express.Router();

apiRouter.use('/reservations', reservationRouter);
apiRouter.use('/schedule', schedulingRouter);
