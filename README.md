# Self-Serve Portal

This is the self-serve portal for UID2 participants. It enables a range of operations for participants around key management, sharing, and so on.

# Getting started

## Requirements

- A recent version of Node. Recommended: 20.11 or later. See [package.json](./package.json) for the required version.
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

Keep in mind that the first time you start the stack, mssql will take ~5 minutes to launch, so you might need to be patient.

## Database

We use knex for migrations and seed data. Once your Docker environment is running, you can use the following commands:

- `npm run knex:migrate:latest`
  - Update your schema to the latest.
- `npm run knex:migrate:down`
  - Undo the last migration that was run.
- `npm run knex:migrate:rollback`
  - Rollback the most recent batch of migrations to your schema. This command can be dangerous as it may rollback multiple migrations, in most cases `down` should be used instead.
- `npm run knex:seed:run`
  - Generate some helpful seed data for a dev or test environment (n.b. this is only for seeding dev/test data).

If you're working on database changes, you can run:

- `npm run knex:migrate:make [migration-name]`
  - Generates a new migration file. This file includes a timestamp and the name you specify after the command.
- `npm run knex:seed:make [seed-name]`
  - Generates a new seed file for providing test data. This file is named based on the name you supply.

See the [Knex migrations documentation](https://knexjs.org/guide/migrations.html) for more details.

### Database Naming Conventions

When creating a database, use `camelCase` table and column names to match the casing in the TypeScript entity classes.

Tables should be created as the plural of the thing being stored. For example, if you're storing a list of possible participant types, the table should be called `participantTypes`.

Linking tables should contain the names of the tables being linked, joined by the word 'To' - but avoid unnecessary duplication. For example, if you're creating a linking table for a many-to-many relationship between `participants` and `participantTypes`, it's reasonable to name the table `participantsToTypes`.

All tables should have an auto-incrementing number column named `id`. When creating references to other tables, prefer to use the column name '<thing>Id', where thing is the thing being referred to. For example, when creating a column which references a participant, you should usually use the column name `participantId`.

## Tech Choices

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- We are making use of the [Radix-UI headless component library](https://www.radix-ui.com/). Please prefer components from this library if you need to introduce a new component. You should review the documentation, especially RE: accessibility.
- Styling is done using Sass. It's very close to plain CSS and is very widely used.
- Storybook. See the section below on how we use Storybook.
- See `/adrs/2022-12-21-Tech_stack.md` for more info.

## Storybook

All components below the page level should be props-driven - data fetching should only happen at the routing level. This allows use of upcoming React features such as progressive rendering, and also enables rapid-iteration development using Storybook.

When developing new components, you should create new stories in Storybook for the key states to allow easy review of both visuals and functionality.

When using our Dialog Component, click on individual stories to avoid an issue where the dialog expands outside the bounds of the box.

## Testing

Please add tests to your changes where possible! We don't have a minimum coverage level because we feel responsible developers should be able to decide what's important to test, and what's not worth testing. Continuing down this path requires us all to be responsible developers and write tests!

Focus on testing functionality, not implementation. For example, if you have a button which waits 1 second and then displays a dialog, _do not_ simulate a click and then assert that `setTimeout(...)` was called. Instead, simulate a click, advance the timer, and make sure the dialog was displayed! Refer to the [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles) and the section of the docs on [Query Priority](https://testing-library.com/docs/queries/about#priority).

To run api tests `npm run test-api` please make sure the docker container is running and the api is not being run.

## Keycloak setup

- Start database and Keycloak server by running `docker compose up -d`. Now Keycloak will be up and running, and the realm will be configured
- To access [keycloak admin console](http://localhost:18080/admin/), you can find the username and password in the `docker-compose.yml`
- If you set an email address for the admin account, you will need to use that email address to log into the Keycloak admin console

For more advanced setup, see [Keycloak Advanced Setup](./KeycloakAdvancedSetup.md).

## Logging stack

#### Tech Stack

For logging, we use [Loki and Grafana](https://grafana.com/oss/loki/) to store and query logs.
We use the [winston-express](https://www.npmjs.com/package/winston-express) helper for [express](https://www.npmjs.com/package/express) in order to log to [winston](https://github.com/winstonjs/winston) from the browser. It helps format and label our log outputs for ingestion into Loki.

#### Development setup

For development purposes, we can can spawn docker images for Loki/Grafana/Promtail to test and validate our loggings.

To do this, an optional docker file is provided `docker-compose.log-stack.yml` in the root folder. This ensures that typical development workflows (that don't need logger stack) don't spawn these additional containers unnecessarily.

To instantiate the logging stack, use the following command:-

```
docker compose -f docker-compose.yml -f docker-compose.log-stack.yml up
```

This will spawn 3 additional containers for Promtail, Loki and Grafana.

Once running, log onto the Grafana UI from [http://localhost:3101](http://localhost:3101). Use the username `admin` and password `admin`.

Add the Loki datasource in Grafana with the following Loki data-source url: `http://host.docker.internal:3100`. Notes: When adding Loki, if the test query fails, try a query in the **Explore** tab as it may have been added and working anyway. This url should match the value of `SSP_LOKI_HOST` in your `.env` file.

The logs should now be available in the **Explore** tab to query - you may need to trigger some API requests in the UI to generate some logs. You can then debug requests by specifying the app name along with a traceId, for example:

```
{app="ssportal-dev"} |= `ae44989e-7654-4e7f-ae7c-8987a829a622`
```

Note: the name of the app should match the `SSP_APP_NAME` in your `.env` file.

## Email Templates

### Adding a New Email Template

To add a new email template to the project, follow the steps below:

1. Locate the `emailTemplates` folder in the project's directory structure. If the folder doesn't exist, create it at the root level of the project.

2. Create a new file for your email template with the following naming convention: `{{templateName}}.hbs`. Replace `{{templateName}}` with a descriptive name for your template. For example, if your template is for a welcome email, you could name the file `welcome.hbs`.

   > Before creating a new template, check if the desired template name already exists in the `templateMapping.json` file located in the `/src/api` directory. If it exists, choose a different template name to avoid overriding an existing template.

3. Open the newly created file in a text editor and write your email template using [Handlebars](https://handlebarsjs.com/) syntax. Handlebars allows you to include placeholders, conditionals, and loops in your template to make it dynamic and personalized.

### Synchronizing with SendGrid

To ensure accurate email rendering, it is important to synchronize the Handlebars email templates with SendGrid. The synchronization process involves updating the SendGrid templates based on the files present in the `emailTemplates` folder. Follow the steps below:

1. Trigger the **Sync Handlebars Template with SendGrid** action located in the repository's Actions tab.

2. Click on the **Run workflow** button to start the synchronization process.

This action should be triggered after adding or updating any templates and before building and publishing Docker images. It ensures that the latest email templates are reflected in SendGrid.

> **Note:** If you only need to update an existing template, you can simply modify the corresponding `.hbs` file and trigger the **Sync Handlebars Template with SendGrid** action. There is no need to redeploy or rebuild Docker images in this case.

## Environment Variables

We do not have a committed `.env` file as it goes against best practice, per https://www.npmjs.com/package/dotenv. However, we do provide a sample `.env.sample` file that can be copied into a `.env` file to get development up and running.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the dependencies for the project. You will need to run this before running any of the following commands.

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

## Setting up UI Dev Environment

The following steps describe the minimal steps required to successfully log in to the portal UI.

1. Set up Docker, as described above: [Docker](README.md#docker)
2. Set up your `.env` file per [Environment Variables](README.md#environment-variables)
3. Ensure your `SSP_KK_SECRET` matches the value in the Keycloak admin console. If it does not, please try [Reset your keycloak realm](./KeycloakAdvancedSetup.md#reset-realm). If all else fails, manually generate your own secret by following: [Generating SSP_KK_SECRET](./KeycloakAdvancedSetup.md#generating-ssp_kk_secret)
4. Run the following to install dependencies:
   ```
   npm install
   ```
5. Run the following to start the API and React front-end:
   ```
   npm run dev
   ```
   Successfully running this will result in the self-serve-portal opening in the browser.
6. Run the following to build the database schema:
   ```
   npm run knex:migrate:latest
   ```
7. Run the following to populate test data:
   ```
   npm run knex:seed:run
   ```
8. Run the Admin service locally by following [Connecting to local Admin service](#connecting-to-local-admin-service)
9. Create an account in the UI by clicking `Create Account`. You can use a fake email address since we use [MailHog](https://github.com/mailhog/MailHog) to capture emails and store them locally.
10. Go to local MailHog at http://localhost:18025/ and you will see an email from `test@self-serve-portal.com` with the subject `Verify email`
11. Open the email and Click `Verify Email`
12. Fill in the form however you want and submit the form
13. Connect to the database server `localhost,11433` using the credentials in [docker-compose.yml](docker-compose.yml) under `KC_DB_USERNAME` and `KC_DB_PASSWORD`
14. In the `uid2_selfserve` database, observe that `dbo.users` now contains a row with with the details you just filled out.
15. Approve your account by updating the `status` of the row in `dbo.participants` that corresponds to your new user, i.e.

    ```
    declare @email as nvarchar(256) = '<Enter your email here>'

    update p
    set status = 'approved'
    from dbo.participants p
    left join dbo.users u
      on p.id = u.participantId
    where u.email = @email
    ```

16. Assign yourself the `api-participant-member` role by following these steps: [Assign Role to a Particular User](./KeycloakAdvancedSetup.md#assign-role-to-a-particular-user)
17. Return to the UI and you should be good to go!

### Connecting to local Admin service

1. Run `uid2-admin` locally by following the README: https://github.com/IABTechLab/uid2-admin
1. Ensure that the site ids of your participants exist in admin. That goes for the current participant you are logged in to, as well as the participants you are interacting (e.g. sharing) with. You can check the existing ids by looking at `sites.json` in `uid2-admin` or by going to http://localhost:8089/adm/site.html and hitting `List Sites`, given the service is running locally.
1. Ensure that you have a key in `admins.json` in `uid2-admin` with the `SHARING_PORTAL` role, and that key is in your `.env` as `SSP_ADMIN_SERVICE_CLIENT_KEY`.
   - You should be able to use an existing key in `admins.json`, rather than having to create a new one.
   - You will need to restart the api (i.e. `npm run api`) after updating your `.env` file.
