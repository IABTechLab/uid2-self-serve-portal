# Self-Serve Portal

This is the self-serve portal for UID2 participants. It enables a range of operations for participants around key management, sharing, and so on.

# Getting started

## Requirements

- A recent version of Node. Recommended: 16.x or later.
- Docker Desktop.
- VS Code (or equivalent). Note that if you don't use VS Code, you will need to find equivalent extensions for things like linting.

Recommended VS Code extensions:
| Extension | Details | Required? |
| --------- | ------- | --------- |
| ESLint | Lints your code. We expect PRs to be free of linter errors, and preferably free of warnings as well. | Yes |
| i18n Ally | Checks your front-end code for accessibility rules. We expect PRs to maintain a high standard of A11y. | Yes |
| Prettier - Code formatter | Formats your code. We want PRs to contain functionality changes, not whitespace fixes and linebreak changes. Prettier makes us all use the same code style so we can focus on the things which matter. | Yes |
| Stylelint | Same as ESLint, but for your style files. | Yes |
| Code Spell Checker | Popular extension by Street Side Software - checks your spelling. | Yes, or similar alternative |
| Wallaby.js | Live, in-your-IDE, as-you-type test runner. It is free for open source projects, but please read the license and satisfy yourself that you're in compliance if you use the free version. | No |
| Docker | Helps you manage docker containers straight from VS Code. | No |
| Auto Rename Tag | Fixes your closing tags as you edit opening tags | No |
| Toggle Quotes | You can hit `ctrl-'` to cycle between quote styles (', ", and `) for the string you're editing. | No |

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

See the [Knex migrations documentation](https://knexjs.org/guide/migrations.html) for more details.

## Tech Choices

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- We are making use of the [Radix-UI headless component library](https://www.radix-ui.com/). Please prefer components from this library if you need to introduce a new component. You should review the documentation, especially RE: accessibility.
- Styling is done using Sass. It's very close to plain CSS and is very widely used.
- Storybook. See the section below on how we use Storybook.
- See `/adrs/2022-12-21-Tech_stack.md` for more info.

## Storybook

All components below the page level should be props-driven - data fetching should only happen at the routing level. This allows use of upcoming React features such as progressive rendering, and also enables rapid-iteration development using Storybook.

When developing new components, you should create new stories in Storybook for the key states to allow easy review of both visuals and functionality.

## Testing

Please add tests to your changes where possible! We don't have a minimum coverage level because we feel responsible developers should be able to decide what's important to test, and what's not worth testing. Continuing down this path requires us all to be responsible developers and write tests!

Focus on testing functionality, not implementation. For example, if you have a button which waits 1 second and then displays a dialog, _do not_ simulate a click and then assert that `setTimeout(...)` was called. Instead, simulate a click, advance the timer, and make sure the dialog was displayed! Refer to the [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles) and the section of the docs on [Query Priority](https://testing-library.com/docs/queries/about#priority).

## Keycloak setup

- Start database and Keycloak serve by run `docker-compose up -d`, Keycloak will be up and running, and the realm will be configured
- To access [keycloak admin console](http://localhost:18080/admin/), you can find username and password in the `docker-compose.yml`
- If you set an email address for the admin account, you will need to use that email address to log into the Keycloak admin console.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Starts both the API and the React front-end side-by-side. This is probably the best way to get up and running in dev mode.

### `npm run storybook`

Starts Storybook. This is a great system for working on self-contained components and reviewing appearance and functionality of components across the site. It's also useful as a way for people to view or work on components (or even whole pages) without having the full environment set up.

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
