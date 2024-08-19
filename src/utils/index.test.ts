import { summarizeDietaryRestrictions } from '.';
import { users } from '@prisma/client';

describe('Test summarizeDietaryRestrictions', () => {
    it('should return no restrictions on empty user list', () => {
        expect(summarizeDietaryRestrictions([])).toEqual({
            servesPaleo: false,
            servesVegetarian: false,
            servesVegan: false,
            servesGlutenFree: false,
        });
    });
    it('should return only the user restrictions when summarizing a list of 1 user', () => {
        const singleUser: users = {
            id: 1,
            email: '',
            phone: '',
            name: '',
            surname: '',
            dietary_restrictions: { paleo: true, vegetarian: true },
        };
        expect(summarizeDietaryRestrictions([singleUser])).toEqual({
            servesPaleo: true,
            servesVegetarian: true,
            servesVegan: false,
            servesGlutenFree: false,
        });
    });
    it('should return summarized dietary restrictions of more than one user', () => {
        const firstUser: users = {
            id: 1,
            email: '',
            phone: '',
            name: '',
            surname: '',
            dietary_restrictions: { paleo: true },
        };
        const lastUser: users = {
            id: 2,
            email: '',
            phone: '',
            name: '',
            surname: '',
            dietary_restrictions: { vegan: true, gluten_free: true },
        };
        expect(summarizeDietaryRestrictions([firstUser, lastUser])).toEqual({
            servesPaleo: true,
            servesVegetarian: false,
            servesVegan: true,
            servesGlutenFree: true,
        });
    });
});
