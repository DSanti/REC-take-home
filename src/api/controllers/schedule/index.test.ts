import request from 'supertest';
import { server } from '../../..';
import { prismaMock } from '../../../testUtils/singleton';

import * as mocks from './mocks';

describe('Schedule controller tests', () => {
    describe('Get available tables', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        afterAll(() => {
            server.close();
        });

        it('Should return a list of available tables', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.findMany.mockResolvedValue([]);
            prismaMock.restaurants.findMany.mockResolvedValue([
                mocks.restaurant,
            ]);
            prismaMock.$queryRaw.mockResolvedValue([mocks.availableTable]);

            const res = await request(server)
                .get('/api/schedule')
                .query(mocks.getScheduleQuery);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([mocks.availableTable]);
        });

        it('Should fail to retrieve available tables, a user already has a reservation for the time.', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.findMany.mockResolvedValue([
                mocks.reservation,
            ]);

            const res = await request(server)
                .get('/api/schedule')
                .query(mocks.getScheduleQuery);

            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual(mocks.scheduleDoubleBookedResponse);
        });
        it('Should fail to retrieve available tables, bad request.', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.findMany.mockResolvedValue([
                mocks.reservation,
            ]);

            const res = await request(server)
                .get('/api/schedule')
                .query(mocks.getScheduleQueryBadRequest);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual(mocks.scheduleBadRequestResponse);
        });
    });
});
