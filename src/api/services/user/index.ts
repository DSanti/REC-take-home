import logger from 'loglevel';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersMultiId = async (
    userIds: number[],
    emails: string[],
    phoneNumbers: string[],
) => {
    const result = await prisma.users.findMany({
        where: {
            OR: [
                {
                    id: {
                        in: userIds,
                    },
                },
                {
                    phone: {
                        in: phoneNumbers,
                    },
                },
                {
                    email: {
                        in: emails,
                    },
                },
            ],
        },
    });
    return result;
};

export const getUsersByIds = async (userIds: number[]) => {
    const result = await prisma.users.findMany({
        where: {
            id: {
                in: userIds,
            },
        },
    });
    return result;
};
