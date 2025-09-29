# Coding Standards

## API Endpoints

- Whenever a database entity is loaded as part of the route (e.g. /participants/123 or /participants/current) or based on the current JWT (e.g. /users/current), that entity **must** be provided by a middleware enricher (e.g. `enrichWithUserFromParams` in `userService.ts`).
  - That enricher is responsible for appropriate authorization checks.
- Whenever another database entity is loaded, deleted, inserted, or updated (i.e. not based on the route or JWT), it **should** use a related query from an entity provided by a middleware enricher.
- Whenever an endpoint makes use of user input (either in the URL or in the request body), it **must** use a Zod parser (e.g. `UpdateUserSchema` in `usersRouter.ts`).
  - If that parser inherits from another (e.g. `EmailContactsDTO` in `emailContactsRouter.ts`), it **must** use an explicit include list - e.g. `.pick` (and not `.omit`) to ensure that the future addition of new fields in the parent parser won't automatically include it.
  - Care must be taken that only fields that the user is allowed to set/update are included in the parser.
- Whenever an endpoint returns data for a participant other than the logged-in participant, the DTO returned **must** map the loaded data to a new object containing only the required fields (e.g. `GET /available` in `participantsRouter.ts`).
- Whenever sensitive things are updated (sharing settings, user access) the audit table must be updated so we know who-did-what-when.
