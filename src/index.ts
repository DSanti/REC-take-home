import express from 'express';
import logger from 'loglevel';
import { apiRouter } from './api/controllers';
import { errorHandler } from './middleware/errorHandler';

const port = process.env.PORT || 3000;

const prodEnviroment = process.env.NODE_ENV === 'production';

logger.setLevel(prodEnviroment ? 'info' : 'debug');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler);

export const server = app.listen(port, () =>
    logger.info(`Server listening on port: ${port}`),
);
