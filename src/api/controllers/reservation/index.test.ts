import request from 'supertest';
import { server } from '../../..';
import { prismaMock } from '../../../testUtils/singleton';
import { APIError } from '../../../classes/apiError';

import * as mocks from './mocks';

describe('Reservation controller tests', () => {
    describe('Reservation creation', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        afterAll(() => {
            server.close();
        });

        it('Should return created reservation', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.create.mockResolvedValue(mocks.reservation);

            const res = await request(server)
                .post('/api/reservations')
                .send(mocks.createReservationRequest);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mocks.createReservationResponse);
        });

        it('Should fail to create reservation, user would be double booked', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.create.mockImplementation(() => {
                throw new APIError(
                    'PrismaClientUnknownRequestError',
                    'Error: Reservations cannot overlap.',
                );
            });

            const res = await request(server)
                .post('/api/reservations')
                .send(mocks.createReservationRequest);

            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual(
                mocks.createReservationDoubleBookingResponse,
            );
        });
        it('Should fail to create reservation, user not associated with the new reservation', async () => {
            const res = await request(server)
                .post('/api/reservations')
                .send(mocks.createReservationUnrelatedRequest);

            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual(mocks.createReservationUnrelatedResponse);
        });
        it('Should fail to create reservation, author of the reservation is not registered', async () => {
            prismaMock.users.findMany.mockResolvedValue([]);

            const res = await request(server)
                .post('/api/reservations')
                .send(mocks.createReservationRequest);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual(
                mocks.createReservationUnregisteredResponse,
            );
        });
    });
    describe('Reservation deletion', () => {
        it('Should return message for successfull deletion', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.findUnique.mockResolvedValue(
                mocks.reservation,
            );
            prismaMock.user_reservation.findMany.mockResolvedValue(
                mocks.deleteReservationUsers,
            );
            prismaMock.reservations.delete.mockResolvedValue(mocks.reservation);

            const res = await request(server)
                .delete('/api/reservations')
                .send(mocks.deleteReservationRequest);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mocks.deleteReservationResponse);
        });
        it('Should fail to delete reservation, user not associated with the reservation', async () => {
            prismaMock.users.findMany.mockResolvedValue([mocks.user]);
            prismaMock.reservations.findUnique.mockResolvedValue(
                mocks.reservation,
            );
            prismaMock.user_reservation.findMany.mockResolvedValue(
                mocks.deleteReservationUsersUnrelated,
            );

            const res = await request(server)
                .delete('/api/reservations')
                .send(mocks.deleteReservationRequest);

            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual(mocks.deleteReservationUnrelatedResponse);
        });
        it('Should fail to delete reservation, user requesting deletion is not registered', async () => {
            prismaMock.users.findMany.mockResolvedValue([]);
            prismaMock.reservations.findUnique.mockResolvedValue(
                mocks.reservation,
            );

            const res = await request(server)
                .delete('/api/reservations')
                .send(mocks.deleteReservationRequest);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual(
                mocks.deleteReservationUnregisteredResponse,
            );
        });
        it('Should fail to delete reservation, reservation not found', async () => {
            prismaMock.reservations.findUnique.mockResolvedValue(null);

            const res = await request(server)
                .delete('/api/reservations')
                .send(mocks.deleteReservationRequest);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual(mocks.deleteReservationNotFoundResponse);
        });
    });
});
