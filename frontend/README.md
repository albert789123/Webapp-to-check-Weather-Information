# Frontend React App

This directory stores all files related to the frontend React app of the project.

## File Structure

[public](public) directory stores all files that are statically served to users, including `index.html` and `manifest.json` and favicons. ***Changes in this folder should mostly be related to metadata and icon, NOT ADDING EXTERNAL SCRIPTS OR STYLESHEETS***.

[build](build) directory stores all files that are transpiled and bundled from the development version of the app. Please ***AVOID DIRECTLY MODIFYING FILES IN THIS FOLDER*** unless you know what you are doing.

[src](src) directory stores all the source files of the app, including `.js` and `.css` files. ***Your development should mostly be in this folder***.

## Serving Locally

To run this app only, you can use the command in this directory:

`npm run start`

If you are at the [root directory](../) and wanting to run this app only, you can use the command:

`npm run frontend`

## Building For Production

To create a production version of the app, you can use the command in this directory:

`npm run build`

If you are at the [root directory](../) and wanting to create a production version of this app, you can use the command:

`npm run predeploy`
