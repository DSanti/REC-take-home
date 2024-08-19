import express from 'express';
import { apiRouter } from './api/controllers';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler);

export const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
);
