export type UserReservation = {
    id: number;
    start_date: Date;
    end_date: Date;
};

export type DietaryRestrictions = {
    servesPaleo: boolean;
    servesVegan: boolean;
    servesVegetarian: boolean;
    servesGlutenFree: boolean;
};

export type AvailableTable = {
    table_id: number;
    restaurant_id: number;
    name: string;
    serves_vegetarian: boolean;
    serves_paleo: boolean;
    serves_vegan: boolean;
    serves_gluten_free: boolean;
    size: number;
    empty_seats: number;
    reservation_id: number;
};
