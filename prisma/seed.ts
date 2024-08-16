import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    // Restaurants

    await prisma.$executeRaw`insert into restaurants  (name, serves_vegan, serves_vegetarian, serves_paleo, serves_gluten_free) VALUES ('Kona', true, true, true, true);`;
    await prisma.$executeRaw`insert into restaurants  (name, serves_vegan, serves_vegetarian, serves_paleo, serves_gluten_free) VALUES ('KFC', false, true, false, false);`;
    await prisma.$executeRaw`insert into restaurants  (name, serves_vegan, serves_vegetarian, serves_paleo, serves_gluten_free) VALUES ('The Cheesecake Factory', false, false, false, false);`;
    await prisma.$executeRaw`insert into restaurants  (name, serves_vegan, serves_vegetarian, serves_paleo, serves_gluten_free) VALUES ('Dino Dinner', false, true, true, false);`;

    // Tables for the restaurants

    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (6);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (3);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (6);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (3);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;
    await prisma.$executeRaw`insert into tables (size) values (6);`;
    await prisma.$executeRaw`insert into tables (size) values (2);`;
    await prisma.$executeRaw`insert into tables (size) values (3);`;
    await prisma.$executeRaw`insert into tables (size) values (4);`;

    // restaurant-table relations

    await prisma.$executeRaw`insert into restaurant_tables values (1,1);`;
    await prisma.$executeRaw`insert into restaurant_tables values (1,2);`;
    await prisma.$executeRaw`insert into restaurant_tables values (1,3);`;
    await prisma.$executeRaw`insert into restaurant_tables values (2,4);`;
    await prisma.$executeRaw`insert into restaurant_tables values (2,5);`;
    await prisma.$executeRaw`insert into restaurant_tables values (2,6);`;
    await prisma.$executeRaw`insert into restaurant_tables values (3,7);`;
    await prisma.$executeRaw`insert into restaurant_tables values (3,8);`;
    await prisma.$executeRaw`insert into restaurant_tables values (3,9);`;
    await prisma.$executeRaw`insert into restaurant_tables values (3,10);`;
    await prisma.$executeRaw`insert into restaurant_tables values (4,11);`;
    await prisma.$executeRaw`insert into restaurant_tables values (4,12);`;
    await prisma.$executeRaw`insert into restaurant_tables values (4,13);`;
    await prisma.$executeRaw`insert into restaurant_tables values (4,14);`;

    // Users

    await prisma.$executeRaw`insert into users (email, phone, name, surname, dietary_restrictions) values ('dean@gmail.com', '+55555555', 'Dean', 'Darwin','{"paleo":true}');`;
    await prisma.$executeRaw`insert into users (email, phone, name, surname, dietary_restrictions) values ('lucy_lakes@gmail.com', '+44444444', 'Lucy', 'Lakes','{"vegan":true}');`;
    await prisma.$executeRaw`insert into users (email, phone, name, surname, dietary_restrictions) values ('mike91@gmail.com', '+33333333', 'Michael', 'Meyers','{"vegetarian":true}');`;
    await prisma.$executeRaw`insert into users (email, phone, name, surname, dietary_restrictions) values ('dmme@stevemail.com', '+22222222', 'Steven', 'Sarajevo','{"gluten_free":true}');`;
    await prisma.$executeRaw`insert into users (email, phone, name, surname, dietary_restrictions) values ('itsthebobster@protonmail.com', '+11111337', 'Bob', 'Boldman','{}');`;

    // Reservations and reservation-user relationships

    await prisma.$executeRaw`insert into reservations (restaurant_id, table_id, start_date, end_date, created_by) values (1, 1, '2024-08-11 19:10:59.89766', '2024-08-11 21:10:59.89766', 1);`;
    await prisma.$executeRaw`insert into user_reservation values (3,1);`;
    await prisma.$executeRaw`insert into user_reservation values (2,1);`;
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
