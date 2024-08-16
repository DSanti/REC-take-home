import logger from 'loglevel';

import { PrismaClient, restaurants } from '@prisma/client';
import { DietaryRestrictions } from '../../../types/types';

const prisma = new PrismaClient();

export const getRestaurantsByDietaryRestrictions = async ({
    servesPaleo,
    servesVegan,
    servesVegetarian,
    servesGlutenFree,
}: DietaryRestrictions) => {
    const filters = {};
    if (servesPaleo) {
        filters['serves_paleo'] = true;
    }
    if (servesVegan) {
        filters['serves_vegan'] = true;
    }
    if (servesVegetarian) {
        filters['serves_vegetarian'] = true;
    }
    if (servesGlutenFree) {
        filters['serves_gluten_free'] = true;
    }

    const result = await prisma.restaurants.findMany({
        where: filters,
    });

    return result;
};
