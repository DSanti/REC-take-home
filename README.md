# REC take home

## Restaurant Booking API

The project is intended to simulate an app for table reservation where a user would search for available tables on restaurants that match the dietary restrictions of the people attending. The solution was built using NodeJS, ExpressJS and Prisma, with Typescript as the programming language and using a Postgres SQL database. Meanwhile, Jest and Supertest were used to unit-test the project.

### Requirements

NodeJs is needed for the project to run, and the host is required to have a Postgresql service running.

### Installation

Download the repository and install the project dependencies

```bash
npm install
```

After that, create a new file called `.env` at the root of the project and set it up following this pattern:

```
// file: .env
DATABASE_URL = postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Where USER, PASSWORD, HOST, PORT and DATABASE should be filled in with the information of your installation of Postgresql.

After this is set up, the next step is to use Prisma migrate to create the database and seed it with some test data.

```bash
npx prisma migrate dev
```

After this, the application is ready to be run on developer mode, using

```bash
npm run dev
```

Running the application in developer mode offers some advantages for development, namely that the project is being watched by `nodemon` to reload and relaunch the app should any file change, and offering stack traces on responses if the execution of an operation throws an error.

To run the application without the development features, first build the application using `tsc` to compile the project into Javascript code.

```bash
npm run build
```

After that, you can start the compiled application with the following command:

```bash
npm run start:prod
```

### Data model

The data model built for the app was designed to facilitate the querying of available tables for a given time of day and group of people. This was identified as the most "expensive" query for the database, and the one that would be executed the most if there were many users concurrently trying to find an available table to book. The second most-called query would be the one that checks if a user already has a reservation for the given reservation time while trying to retrieve available tables to book.

As the diagram shows, most entities have a table to store their data, and there are two tables that store information on the 1..n relationship between reservations and users, and restaurants and tables.

### Usage

The application accepts requests on two endpoints, `/api/reservations` and `/api/schedule` .

#### Reservation API

The endpoint supports two operations, `POST` for the creation and `DELETE` for the deletion of reservations.

-   `POST` requests are sent to the base URL for the endpoint, `/api/reservations` and are required to send a JSON body with the following structure:

    ```json
    {
        "userIds": [1, 2], // Array with the ids of the users in the reservation
        "reservationStart": "2024-08-11T06:10:00.000Z", // ISO8601 date for the start of the reservation
        "createdBy": 1, // Id of the user making the reservation
        "tableId": 5, // Id of the table being booked
        "restaurantId": 44 // Id of the restaurant
    }
    ```

    If the reservation is successfully created, the endpoint will respond `200 OK` and contain information about the newly created reservation.

    ```json
    {
        "id": 21,
        "restaurant_id": 44,
        "table_id": 5,
        "start_date": "2024-08-11T06:10:00.000Z",
        "end_date": "2024-08-11T08:10:00.000Z",
        "created_by": 1
    }
    ```

-   `DELETE` requests send the reservation's id to be deleted as part of the URL `/api/reservations/$RESERVATION_ID`. The application requires the id of the user requesting the deletion of the reservation to be sent in the body of the request:

    ```json
    {
        "deletedBy": 1 // Id of the user deleting the reservation
    }
    ```

    If the reservation is successfully deleted, the endpoint will respond `200 OK` with a small message confirming the deletion:

    ```json
    {
        "message": "Reservation with id 21 was deleted successfully."
    }
    ```

#### Schedule API

The schedule endpoint only allows for one operation, `GET`, which will retrieve all available tables that match the users dietary restrictions and taking into account the current availability of each restaurant's tables at the reservation date.

-   `GET` requests are sent to the base URL of the endpoint, `/api/schedule` with query parameters to communicate the desired reservation time:

    | Query Parameter    | Description                                                                       |
    | :----------------- | --------------------------------------------------------------------------------- |
    | `userIds`          | List of every id from a registered user attending                                 |
    | `userEmails`       | List of emails from unregistered or possibly unregistered users attending.        |
    | `userPhoneNumbers` | List of phone numbers from unregistered or possibly unregistered users attending. |
    | `reservationStart` | Desired reservation start date and time.                                          |
    | `additionalSeats`  | Number of additional                                                              |

    Every query parameter is required, even if empty.

    An example of a request would be `/api/schedule?userIds=4,5&userEmails=firstEmail%40gmail.com&userPhoneNumbers=%2B555982285&reservationStart=2024-08-11T06%3A10%3A00.000Z&additionalSeats=4`
    
    The endpoint will respond with a list of available tables to be booked that match the number of users attending the reservation and their dietary restrictions. The response also has information about the restaurant where the table is located, size of the table and it's remaining empty seats. The list of tables is ordered by this field, so as to prioritize the tables that fit the group's size better first, and the ones that require under-seating further down the list.

### Testing

The application currently has unit tests that assert the different outcomes from every endpoint, both successfull and unsuccessfull requests. You can run the test suite using the command:

```bash
npm run test
```

This will execute every test found on the project's directory and display a coverage report on every file.

### Considerations

When designing the system, several key considerations were taken into account to ensure the solution would meet every requirement and use case presented in the challenge and its FAQ. These include:

- The schedule service allows for under seating, ordering the available tables by empty seats to prioritize the ones that fit the group better.
- While searching for available tables, both emails and phone numbers are accepted, and the application will try to identify registered users using them. In this way, the frontend would allow users to consider their friends' dietary restrictions even if their ``userIds`` are not known to the frontend client at the time.
- The ``additionalSeats`` parameter allows users to book tables taking into account unregistered users attending the reservation
- Before trying to find a table for a group, the Schedule API will check if any user in the group has a reservation that would overlap with the one being searched for. Because this is checked before searching for available tables, the error can be sent to the frontend before the user tries to create a reservation, instead of failing to create a reservation after the user has already seen the tables availability, improving the using experience.
- While the application does not currently support anticipation time restrictions to create a reservation or search for a table, or a cancellation time window for deleting a reservation, the database already has columns to store that information in a per-restaurant basis.
  - In the same vein, the database has columns to store opening and closing hours on a per-restaurant basis to support the development of the feature down the line.
- Because users would search for available tables, and then create a reservation for one, a user could try to book a table that has been booked since he last searched for tables. To solve this, a trigger was configured on the ``reservations`` table that checks before a new row is added. If the new reservation would overlap with any other reservation already stored, it will raise an exception and block the transaction. This ensures that the first reservation creation request wins, and that there cannot be overlapping reservations in the database.
- In the case of reservation deletion, the user making the request must be part of the reservation to begin with. This is one of the scenarios in the FAQ, where any attendee has permission to delete or cancel a reservation that they are part of.

### Further improvements

As the take home challenge has a defined scope and period of time to be completed, there are improvements to the application that were identified but not implemented so as to deliver the project in a timely manner.

Some of them are:

- Integration tests using docker to create test environment and database.
- Further refinement of error messages, both for diagnosing problems while debugging and to serve the frontend better responses if their requests fail.
- Implementation of opening and closing hours as restrictions to search and create reservations.
- Implementation of minimum advance notice time to create reservations, and cancellation time window for deleting them.
- Database logs.
- Logical deletion for reservations, to maintain records of all created reservations.
