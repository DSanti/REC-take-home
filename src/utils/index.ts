import { users } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const summarizeDietaryRestrictions = (users: users[]) => {
    const summarizedRestrictions = {
        servesPaleo: false,
        servesVegetarian: false,
        servesVegan: false,
        servesGlutenFree: false,
    };

    for (const u of users) {
        const dietRestrictions = u.dietary_restrictions as Prisma.JsonObject;
        if (dietRestrictions.paleo) {
            summarizedRestrictions.servesPaleo = true;
        }
        if (dietRestrictions.vegetarian) {
            summarizedRestrictions.servesVegetarian = true;
        }
        if (dietRestrictions.vegan) {
            summarizedRestrictions.servesVegan = true;
        }
        if (dietRestrictions.gluten_free) {
            summarizedRestrictions.servesGlutenFree = true;
        }
    }

    return summarizedRestrictions;
};
