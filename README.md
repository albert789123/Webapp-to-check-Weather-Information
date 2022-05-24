# CSCI2720 Group 22 Course Project

This is the repository for the course project of CSCI2720 Group 22. 

## Acknowledging Academic Honesty

All of the members in Group 22 have carefully read the article listed in [http://www.cuhk.edu.hk/policy/academichonesty/](http://www.cuhk.edu.hk/policy/academichonesty/) and have acknowledged.

## Site URLs

The site contains the following URLs:

- `/` is the main entry point. This page provides login and registration.
- `/map` is the map page with all the available locations marked.
- `/table` is a table page showing all location data and pollution data in a table format.
- `/details/:id` is the single location page showing the location details and the user comments.
- `/locDB` is an admin page showing all locations in a table for creating, editing and deleting locations.
- `/userDB` is an admin page showing all users in a table for creating, editing and deleting users.
- `/using-graphql` is an informative page showing all available queries for the GraphQL endpoints in the backend server.

In development mode, the frontend app has the base url of `localhost:3000` while the backend server has the base url of `localhost:5000` (Subject to change based on the `port` in [`backend/config.json`](backend/config.json)). Please read [`backend/README.md`](backend/README.md) for the available endpoints for the backend.

In production mode, the frontend app will have the base url same as that of the backend server.

## File Structure

[frontend](frontend) directory stores all files related to the frontend React app of this project.

[backend](backend) directory stores all files related to the backend ExpressJS app of this project.

## First Time Setup

Before serving either the frontend or the backend, you should run the following command to install the required node modules:

`npm run setup`

If you only want to setup frontend, you can also use this command instead:

`npm run setup-frontend`

Conversely, you can use this command for setting up the backend only:

`np run setup-backend`

## Serving For Development Locally

To start the local development mode for both the frontend and backend at the same time, first change `mode` in [`frontend/src/config.json`](frontend/src/config.json) into `production`, you then can use the following command:

`npm run serve`

If you only want to start the dev mode for the frontend app, first change `mode` in [`frontend/src/config.json`](frontend/src/config.json) into `production`, you then can also use this command:

`npm run frontend`

Conversely, you can use this command to start the dev mode of the backend only:

`npm run dev`

## Building For Production

To build and run the whole project directly, first change `mode` in [`frontend/src/config.json`](frontend/src/config.json) into `production`, then use the following command:

`npm run start`

If you want to simply build the project but not to run it right after, first change `mode` in [`frontend/src/config.json`](frontend/src/config.json) into `production`,use the following command:

`npm run predeploy`

If you have built the project and would like to run it directly, use the following command:

`npm run backend:prod`
