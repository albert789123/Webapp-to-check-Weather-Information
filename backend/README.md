# Backend Express App

This directory stores all files related to the backend ExpressJS app of the project.

## File Structure

[`index.js`](index.js) is the main entry point of the backend ExpressJS app. All sub-routes of the API server should be declared in this file.

[`config.json`](config.json) stores some configurations (like pollution data URL) for the backend ExpressJS app.

[routes](routes) directory stores all route files, with each file representing a sub-route of the API server.

[models](models) directory stores all model files, with each file representing the respective Mongoose data model and schema. 

[middlewares](middlewares) directory stores all middleware files, with each file representing one custom middleware.

[errors](errors) directory stores custom HTTP errors that can be caught by error middleware.

[misc](misc) directory stores miscellaneous files for the backend.

[utils](utils) directory stores utility function files for the backend.

## Serving For Development Locally

To run this backend app in development mode only, you can use the command in this directory:

`cd .. && npm run backend`

If you want to run this backend app in production mode, you can use the comment in this directory:

`cd .. && npm run backend:prod`

## Accessing Endpoints with Login Requirement

Follow the steps below to access endpoints which require login:
1. Login using [`POST /users/login`](#post-userslogin) and obtain the JWT fron the `token` field of the response body.
2. Attach the JWT in the request header `Authorization` with the format of `Bearer <JWT>`.

## GraphQL API Endpoint
To use the GraphQL route for getting location information. Example query with all available fields selected:
```graphql
query{
  locations {
    name
    long
    lat
    address
    
    pollutions {
      datetime
      no2
      o3
      so2
      co
      pm10
      pm2_5
    }
   
    comments {
      user
      comment
      emotion
    }
  }
  
  location(locId: "someproperlocid") {
    #same as locations
  }
}
```

### `GET /graphql`
Include the GraphQL query in the query parameter named `query` of the request.

### `POST /graphql`
Include the GraphQL query in a field `query` inside a JSON request body.

## Auth API Endpoints

### `POST /users`
Create new user account. Example request body, with `name` and `password` required:
```json
{
  "name": "username",
  "password": "verysecurepwd"
}
```

### `DELETE /users/:userId`(Admin Login Required)
Delete user account by `userId`.

### `PATCH /users/:userId`(Admin Login Required)
Update user infomation. Request body has the same fields as [`POST /users`](#post-users).

### `POST /users/login`
Login to a user account. Request body has the same fields as [`POST /users`](#post-users).

### `POST /users/reset`
Reset the comments and favourite locations of the user. Example request body, with at least one of `resetComments` or `resetFavLocations` need to be set as `true`:
```json
{
  "resetComments": true,
  "resetFavLocations": false
}
```

## Location API Endpoints

### `GET /locations`
Get location information of weather stations and fetch new pollution information if needed. Query parameter `refreshPollution` can be set to force the fetching of new pollution information.

### `GET /locations/:locId`
Get location information by ID and fetch new pollution information if needed. Query parameter `refreshPollution` can be set to force the fetching of new pollution information.

### `POST /locations`
Create new location. Example request body, with `name`, `long` and `lat` required:
```json
{
  "name": "Southern Air Quality Monitoring Station",
  "long": 114.1601401, 
  "lat": 22.24746092, 
  "address": "No.1 Aberdeen Praya Road, Hong Kong."
}
```

### `PATCH /locations/:locId`
Update location with ID of `locId`. Request body has the same fields as [`POST /locations`](#post-locations) but with all fields optional.

### `DELETE /locations/:locId`(Admin Login Required)
Delete location with ID of `locId` and related pollution information.

### `PUT /locations/load`
Load default location information stored in [weather_stations.json](misc/weather_stations.json).

### `GET /locations/:locId/pollutions`
Get pollution information of the location with ID of `locId` and fetch new pollution information if needed.

### `POST /locations/:locId/favourite`(Login Required)
Add the location with ID of `locId` to the list of favourite locations of the user.

### `DELETE /locations/:locId/favourite`(Login Required)
Delete favourite location with ID of `locId` of the user.

### `GET /users/favourites`(Login Required)
Get the favourite locations of the user.

## Comment API Endpoints

### `GET /locations/:locId/comments`
Get user comments of the location with ID of `locId`. 

### `POST /locations/:locId/comments`(Login Required)
Create new user comment for location with ID of `locId`. Example request body, with `comment` and `emotion` required:
```json
{
  "comment": "This is a comment.",
  "emotion": "happy"
}
```

### `DELETE /comments/:commentId`(Login Required)
Delete comment with ID of `commentId`.

### `PATCH /comments/:commentId`(Login Required)
Update comment with ID of `commentId`. Request body has the same fields as [`POST /locations/:locId/comments`](#post-locationslocidcommentslogin-required) but with all fields optional.




