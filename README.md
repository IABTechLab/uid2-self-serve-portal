# Self-Serve Portal

This is the self-serve portal for UID2 participants. It enables a range of operations for participants around key management, sharing, and so on.

# Getting started

## Requirements

- A recent version of Node. Recommended: 16.x or later.
- Docker Desktop.
- VS Code (or equivalent).

## Docker

When you first check the repo out, run:

```
docker compose up
```

This will pull the needed docker images and start the stack. **IMPORTANT:** The first time you run this, the mssql database container will take a while to start. If you interrupt it during this process, the container may end up in a bad state. If this happens, you'll need to `docker compose down` and then manually delete the persistent volume first, then start over.

If you get errors like `Login failed for user 'sa'. Reason: Failed to open the explicitly specified database 'keycloak'`, the Keycloak container probably tried to start before the database was ready. Run the following command to try again:

```
docker compose restart keycloak
```

Keep in mind that the first time you start the stack, mssql will take ~5 minutes to aunch, so you might need to be patient.

## Database

We use knex for migrations and seed data. Once your Docker environment is running, you can use the following commands:

- `npm run knex:migrate:latest`
  - Update your schema to the latest.
- `npm run knex:migrate:rollback`
  - Rollback the most recent update to your schema.
- `npm run knex:seed:run`
  - Generate some helpful seed data for a dev or test environment (n.b. this is only for seeding dev/test data).

If you're working on database changes, you can run:

- `npm run knex:migrate:make [migration-name]`
  - Generates a new migration file. This file includes a timestamp and the name you specify after the command.
- `npm run knex:seed:make [seed-name]`
  - Generates a new seed file for providing test data. This file is named based on the name you supply.

## Tech Choices

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- We are making use of the [Radix-UI headless component library](https://www.radix-ui.com/). Please prefer components from this library if you need to introduce a new component. You should review the documentation, especially RE: accessibility.
- Styling is done using Sass. It's very close to plain CSS and is very widely used.
- Storybook. See the section below on how we use Storybook.
- See `/adrs/2022-12-21-Tech_stack.md` for more info.

## Storybook

All components below the page level should be props-driven - data fetching should only happen at the routing level. This allows use of upcoming React features such as progressive rendering, and also enables rapid-iteration development using Storybook.

When developing new components, you should create new stories in Storybook for the key states to allow easy review of both visuals and functionality.

## Keycloak setup

- Start database and Keycloak serve by run `docker-compose up`
- Open [http://localhost:18080/admin](http://localhost:18080/admin/) and log in with the username and password which you can find in the `docker-compose.yml`.
- Click `master` to open the dropdown menue and click `Create Realm`
- Click `Browser` and select `keycloack/realm-export.json` and then click `Create`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed! Note that builds for deployment are not made on developer machines - those happen in our CI pipeline.

### `npm run storybook`

Starts Storybook. This is a great system for working on self-contained components and reviewing appearance and functionality of components across the site.

### `npm run build-storybook`

Build the Storybook site into a static website, if you need that for some reason. (Should this be removed? I don't know if it's needed.)
