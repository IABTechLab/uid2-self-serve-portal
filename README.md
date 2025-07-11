# Self-Serve Portal

This is the self-serve portal for UID2 participants. It enables a range of operations for participants around key management, sharing, and so on.

# Getting started

## Requirements

- A recent version of Node. Recommended: 20.11 or later. See [package.json](./package.json) under `"engines"` for the required version.
- Docker Desktop.
- VS Code (or equivalent). Note that if you don't use VS Code, you will need to find equivalent extensions for things like linting.

Recommended VS Code extensions:

| Extension                 | Details                                                                                                                                                                                                | Required?                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| ESLint                    | Lints your code. We expect PRs to be free of linter errors, and preferably free of warnings as well.                                                                                                   | Yes                         |
| i18n Ally                 | Checks your front-end code for accessibility rules. We expect PRs to maintain a high standard of A11y.                                                                                                 | Yes                         |
| Prettier - Code formatter | Formats your code. We want PRs to contain functionality changes, not whitespace fixes and linebreak changes. Prettier makes us all use the same code style so we can focus on the things which matter. | Yes                         |
| Stylelint                 | Same as ESLint, but for your style files.                                                                                                                                                              | Yes                         |
| Code Spell Checker        | Popular extension by Street Side Software - checks your spelling.                                                                                                                                      | Yes, or similar alternative |
| Wallaby.js                | Live, in-your-IDE, as-you-type test runner. It is free for open source projects, but please read the license and satisfy yourself that you're in compliance if you use the free version.               | No                          |
| Docker                    | Helps you manage docker containers straight from VS Code.                                                                                                                                              | No                          |
| Auto Rename Tag           | Fixes your closing tags as you edit opening tags                                                                                                                                                       | No                          |
| Toggle Quotes             | You can hit `ctrl-'` to cycle between quote styles (', ", and `) for the string you're editing.                                                                                                        | No                          |
| SonarLint                 | Detects and highlights issues that can lead to bugs, vulnerabilities, and code smells.                                                                                                                 | No                          |

## Docker

When you first check the repo out, run:

```
docker compose up
```

This will pull the needed docker images and start the stack. **IMPORTANT:** The first time you run this, the mssql database container will take a while to start. If you interrupt it during this process, the container may end up in a bad state. If this happens, you'll need to `docker compose down` and then manually delete the persistent volume first, then start over.

If you get errors like `Login failed for user 'sa'. Reason: Failed to open the explicitly specified database 'keycloak'` or `dependency failed to start: container uid2_selfserve_mssql is unhealthy`, the Keycloak container probably tried to start before the database was ready. Run the following command to try again:

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

## Keycloak

The portal uses [Keycloak](https://www.keycloak.org/) as the identity and access management solution.

### Keycloak setup

- Start database and Keycloak server by running `docker compose up -d`. Now Keycloak will be up and running, and the realm will be configured

#### Keycloak admin console

- The Keycloak admin console runs at http://localhost:18080/admin/
- The username and password are stored in [docker-compose.yml](./docker-compose.yml)
- If you set an email address for the admin account, you will need to use that email address to log into the Keycloak admin console

For more advanced setup, see [Keycloak Advanced Setup](./KeycloakAdvancedSetup.md).

### Upgrading Keycloak

See https://github.com/IABTechLab/uid2-self-serve-portal/pull/98/files for an example PR for how to upgrade Keycloak. Note that changes to `Dockerfile_keycloak` often need to be mirrored in [docker-compose.yml](./docker-compose.yml). You can use `docker build` and `docker run` to manually test the `Dockerfile_keycloak` locally, see https://github.com/IABTechLab/uid2-self-serve-portal/pull/347 for an example. You will likely need to upgrade the [keycloak-js](https://www.npmjs.com/package/keycloak-js) package as well.

Keycloak also provides [Upgrading Guides](https://www.keycloak.org/docs/latest/upgrading/index.html) for each version.

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

We do not have a committed `.env` file as it goes against best practice, per https://www.npmjs.com/package/dotenv. However, we do provide a [.env.sample](./.env.sample) file that can be copied into a `.env` file to get development up and running.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the dependencies for the project. You will need to run this before running any of the following commands.

### [`./run_portal.ps1`](./run_portal.ps1)

The quickest way to get the portal running locally via a single PowerShell script. This will run the admin service as well as the portal docker, API and web-application. This script assumes that `uid2-admin` and `uid2-self-serve-portal` have the same parent folder.

### `npm run dev`

Starts both the API and the React front-end side-by-side. This is probably the best way to get up and running in dev mode.

### `npm run storybook`

Starts Storybook. This is a great system for working on self-contained components and reviewing appearance and functionality of components across the site. It's also useful as a way for people to view or work on components (or even whole pages) without having the full environment set up.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run api`

Run the API on port 6540 by default. The API server will restart if you make edits, and you will see logs in the console. Useful if you need to debug the API separately from the UI.

### `npm test`

Launches the test runner in the interactive watch mode.\
See Create React App's section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test-api`

Runs the API tests on port 6541 by default. You must ensure the docker container is running. You must run these tests manually on your branch as they do not automatically run as part of the [Build and Test workflow](/.github/workflows/build-and-test.yaml).

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed! Note that builds for deployment are not made on developer machines - those happen in our CI pipeline.

### `npm run lint`

Runs [eslint](https://eslint.org/), to help find problems in the code.

### `npm run lint-fix`

Instructs ESLint to try to fix as many issues as possible, see https://eslint.org/docs/latest/use/command-line-interface#fix-problems.

## Setting up UI Dev Environment

The following steps describe the minimal steps required to successfully log in to the portal UI.

1. Run the Admin service locally by following [Connecting to local Admin service](#connecting-to-local-admin-service)
1. Set up Docker, as described above: [Docker](README.md#docker)
1. Set up your `.env` file per [Environment Variables](README.md#environment-variables)
1. Run the following to install dependencies:
   ```
   npm install
   ```
1. Run the following to build the database schema:
   ```
   npm run knex:migrate:latest
   ```
1. Run the following to populate test data:
   ```
   npm run knex:seed:run
   ```
1. Ensure that the Keycloak Docker is running. It often attempts to start before the keycloack database has been populated.
1. Run the following to start the API and React front-end:
   ```
   npm run dev
   ```
   Successfully running this will result in the self-serve-portal opening in the browser.
   You may need to refresh the page once as an error often occurs on the first run.
1. A test user is created automatically in in the seed data but you must set a password. Go to http://localhost:3000/ and click the `Forgot Password` button.
1. Enter the following test email address: `sample_user@example.com` and click `Request Password Reset`
1. Go to local MailHog at http://localhost:18025/ and you will see an email from `noreply@unifiedid.com` with the subject `Reset Password`
1. Open the email and Click `Reset Password`
1. Choose a password
1. Log into the Self Service Portal (http://localhost:3000/)

#### Notes for Mac OSX Development:

1. For Apple Silicon machines, you must ensure that Rosetta 2 is installed and Rosetta is enabled in Docker Desktop.
1. You will need to change the permissions on your development directories. They will not be editable by default when cloned from github
1. If using Visual Studio Code, you may need to set `FAST_REFRESH=false` in your .env file
1. Azure Data Studio is an adequate program for manipulating the SQL Server database

### UID2 Support Screens/Routes

You will want to assign some API Permissions to your participant in the `Manage Participants` screen. This will allow you to use the full functionality of the `API Keys` screen.

### Connecting to local Admin service

1. Run `uid2-admin` locally by following the README: https://github.com/IABTechLab/uid2-admin
1. Ensure that the site IDs of your participants exist in admin. That goes for the current participant you are logged in to, as well as the participants you are interacting (e.g. sharing) with. You can check the existing IDs by looking at `sites.json` in `uid2-admin` or by going to http://localhost:8089/adm/site.html and hitting `List Sites`, given the service is running locally.

   1. To assign a site to your participant, run the following SQL:

      ```
      use [uid2_selfserve]

      update dbo.participants
      set siteId = <enter a valid site id> -- e.g. 999
      where id = <Enter your participant id> -- should be 7 for brand new devs

      ```

1. If you wish to test uid2-admin service with Okta auth enabled, ensure that you have set `SSP_OKTA_AUTH_DISABLED` to false in your `.env`, and fill in the `SSP_OKTA_CLIENT_SECRET` value. You will also need to update `is_auth_disabled` to false in your uid2-admin local-config.json, and fill in the `okta_client_secret` value.
   - You can find the keys for local testing in 1Password under "Okta localhost deployment".
   - Make sure you use the key from the uid2-self-serve-portal subsection for ssportal and the value from the uid2-admin subsection for admin.
   - You will need to restart the api (i.e. `npm run api`) after updating your `.env` file.

### Troubleshooting

- Ensure your `SSP_KK_SECRET` matches the Client Secret in the Keycloak admin console, see: [Keycloak Client Secret](./KeycloakAdvancedSetup.md#keycloak-client-secret).
